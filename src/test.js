const {app, BrowserWindow, ipcMain} = require("electron");
const openForm = require('./index');

app.whenReady().then(test);

async function test() {
    let inputs = [
        {
            type: "text",
            name: "telegramToken",
            attributes: {
                placeholder :'Enter telegram token',
                required:true
            },
            label: 'Telegram token'
        },
        {
            type: "text",
            name: "allowedUsernames",
            attributes: {
                placeholder :'Enter login or logins separated by ,',
                required:true

            },
            label: 'Allowed usernames'
        },
    ]
    console.log(await openForm(inputs , {width: 640, height: 480, resizable:true}))
}
