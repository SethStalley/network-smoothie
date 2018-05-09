'use strict'

const DispatchInterface = require('./DispatchInterface')
const WindowsProxy = require('./WindowsProxy')

let dispatchInterface = new DispatchInterface()
const windows = new WindowsProxy()

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
}

function stopBonding() {
    console.log("Stopping service.")
    dispatchInterface.stop()
    document.getElementById('label-enable-service').innerHTML = 'off'
}

/*
    UI Controls
*/

// Main start/stop toggle
const mainSwitch = document.getElementById('enable-service')
mainSwitch.onclick = ()=> {
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

setNetworks()
// If not running then pool network list.
setInterval(()=> {
    if(!this.running)
        setNetworks()
}, 5000)
