'use strict'

const ipcRenderer = require('electron').ipcRenderer;
const DispatchInterface = require('./DispatchInterface')
const WindowsProxy = require('./WindowsProxy')

let dispatchInterface = new DispatchInterface()
const windows = new WindowsProxy()

const mainSwitchElement = document.getElementById('enable-service')
const updateDialogElement = document.getElementById('update-dialog')
const agreeUpdateBtn = document.getElementById('agree-update-button')
const disagreeUpdateBtn = document.getElementById('disagree-update-button')

function setNetworks() {
    const networkAdapters = dispatchInterface.getNetworkAdapters()
    
    let allCardsFormatted = ''
    for (let i=0; i<networkAdapters.length; i++) {
        const {name, address} = networkAdapters[i]
        const icon = name.includes('net') ? 'code' : 'wifi';
        const card = `
            <x-card>
                <header>
                    <x-icon name="${icon}" style="padding-right: 3%;"></x-icon>
                    <strong>${name}</strong>
                    <span style="padding-left: 1%; font-size: 14px;">(${address})</span>
                </header>
            </x-card>`
            allCardsFormatted += card 
    }

    document.getElementById('networks').innerHTML = allCardsFormatted
}

function startBonding() {
    console.log("Starting service.")
    dispatchInterface.startSocks()
    document.getElementById('label-enable-service').innerHTML = 'on'
    document.getElementById('main-card').style = "background-color: #009788;"
}

function stopBonding() {
    console.log("Stopping service.")
    dispatchInterface.stop()
    document.getElementById('label-enable-service').innerHTML = 'off'
    document.getElementById('main-card').style = ""
}

/*
    UI Actions
*/
function openUpdateDialog() {
    updateDialogElement.setAttribute('open', '')
}

function closeUpdateDialog() {
    updateDialogElement.removeAttribute('open')
}


/*
    Event Listeners
*/
// Main start/stop toggle
mainSwitchElement.onclick = ()=> {
    if (this.running) {
        setNetworks()
        windows.disableSocksProxy()
        stopBonding()
        this.running = false
    } else {
        this.running = true
        startBonding()
        windows.enableSocksProxy()
    }
}

disagreeUpdateBtn.onclick = ()=> {
    closeUpdateDialog()
}

agreeUpdateBtn.onclick = ()=> {
    ipcRenderer.send('quitAndInstall')
}

// wait for an updateReady message
ipcRenderer.on('updateReady', function(event, text) {
    openUpdateDialog()
})

setNetworks()
// If not running then pool network list.
setInterval(()=> {
    if(!this.running)
        setNetworks()
}, 10000)
