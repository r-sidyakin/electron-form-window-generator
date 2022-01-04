const {app} = require("electron");
const openForm = require('./index');

app.whenReady().then(test);

async function test() {
    let inputs = [
        {
            type: "select",
            name: "language",
            label: 'Language',
            options: {
                a:'1',
                b:'2',
            },
            attributes: {
                size: 1,
                required: true,
            },
        },
        {
            type: "select",
            name: "language",
            label: 'Language',
            options: {
                a:'1',
                b:'2',
            },
            attributes: {
                size: 1,
                required: true,
            },
        },
        {
            type: "text",
            name: "name1",
            attributes: {
                placeholder :'Enter text',
                required:true
            },
            label: 'Text'
        },
        {
            type: "text",
            name: "name2",
            attributes: {
                placeholder :'Enter other text',
                required:true

            },
            label: 'Other text'
        },
    ]
    console.log(await openForm(inputs ,
        {width: 640, height: 480, resizable:true}))
}


