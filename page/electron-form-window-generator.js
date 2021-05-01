const {ipcRenderer} = require("electron");
const id = document.location.hash.replace('#', '');
let formHTML = ipcRenderer.sendSync(`electron-form-window-generator:get-formHTML:${id}`)
let form = document.forms[0];

document.getElementById("form-container").innerHTML = formHTML;

form.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        returnFormValues();
    }
});
form.addEventListener('submit', returnFormValues);

function returnFormValues() {
    if (!form.reportValidity())
        return false

    let data = {}
    for (let input of Array.from(form.querySelectorAll("input")))
        data[input.name] = input.value

    ipcRenderer.sendSync(`electron-form-window-generator:submit:${id}`, data)
}

