import {app, BrowserWindow, ipcMain} from "electron";

import formG from "html-form-generator";
import path from "path";
import * as url from "url";

const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 240;

export default function openForm(inputs: any[], options?, parentWindow?) : any {
    return new Promise(async (resolve, reject) => {
        const id = `${new Date().getTime()}-${Math.random()}`;

        const options_ = Object.assign(
            {
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
                minWidth: DEFAULT_WIDTH,
                minHeight: DEFAULT_HEIGHT,
                resizable: false,
                title: 'Form',
                alwaysOnTop: false,
                icon: null,
                menuBarVisible: false,
                skipTaskbar: true
            },
            options || {}
        );

        let formWindow = new BrowserWindow({
            width: options_.width,
            height: options_.height,
            minWidth: options_.minWidth,
            minHeight: options_.minHeight,
            resizable: options_.resizable,
            minimizable: false,
            fullscreenable: false,
            maximizable: false,
            parent: parentWindow,
            skipTaskbar: options_.skipTaskbar,
            alwaysOnTop: options_.alwaysOnTop,
            useContentSize: options_.resizable,
            modal: Boolean(parentWindow),
            title: options_.title,
            icon: options_.icon || undefined,
            webPreferences: {
                nodeIntegration: true
            }
        });

        formWindow.setMenu(null);
        formWindow.setMenuBarVisibility(options_.menuBarVisible);

        for (let input of inputs) {
            if (!input.classes)
                input.classes = []

            if (input.type === 'text')
                input.classes.push('w3-input')

            if (input.type === 'button')
                input.classes.push('w3-btn w3-black')

            if (input.type === 'checkbox')
                input.classes.push('w3-check')

            if (input.type === 'radio')
                input.classes.push('w3-radio')

            if (input.type === 'select')
                input.classes.push('w3-select')

        }

        inputs.push({
            type: "submit",
            name: "Enter",
            classes: ["w3-btn w3-black"],
            attributes:{
                id:"enter"
            }
        })

        let form = await formG.generate(inputs, '<br>')
        const promptUrl = url.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(__dirname, '../page', 'index.html'),
            hash: id
        });


        const getFormHtml = (event) => {
            event.returnValue = form;
        }

        const submit = (event, arg) => {
            resolve(arg);
            cleanup();
        }
        const cleanup = () => {
            ipcMain.removeListener(`electron-form-window-generator:get-formHTML:${id}`, getFormHtml);
            ipcMain.removeListener(`electron-form-window-generator:submit:${id}`, submit);

            if (formWindow) {
                formWindow.close();
                formWindow = null;
            }
        };

        const unresponsiveListener = () => {
            reject(new Error('Window was unresponsive'));
            cleanup();
        };

        ipcMain.on(`electron-form-window-generator:get-formHTML:${id}`, getFormHtml)
        ipcMain.on(`electron-form-window-generator:submit:${id}`, submit)

        formWindow.on('closed', () => {
            formWindow = null;
            cleanup();
            resolve(null);
        });

        formWindow.on('unresponsive', unresponsiveListener);

        await formWindow.loadURL(promptUrl);
    })
}