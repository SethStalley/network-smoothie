'use strict'

const DispatchInterface = require('./DispatchInterface')
const WindowsProxy = require('./WindowsProxy')

const dispatchInterface = new DispatchInterface()
const windows = new WindowsProxy()

function setNetworks() {
    const networkAdapters = dispatchInterface.getNetworkAdapters()
    
    let allCardsFormatted = ''
    for (let i=0; i<networkAdapters.length; i++) {
        const {name, address} = networkAdapters[i]
        const card = `
            <x-card>
                <header>
                    <strong>${name}</strong>
                    <span style="padding-left: 1%; font-size: 14px;">(${address})</span>
                </header>
            </x-card>`
            allCardsFormatted += card 
    }

    document.getElementById('networks').innerHTML = allCardsFormatted
}

function bondNetworks() {
    const address = dispatchInterface.getNetworkAdapters()
    if (address) {
        dispatchInterface.startSocks(address)
        return true
    }
    
    console.log(`Error:`, 'No network addresses available.')
    return false
}

function startBonding() {
    console.log("Starting service.")
    document.getElementById('label-enable-service').innerHTML = 'on'
    return bondNetworks()
}

function stopBonding() {
    console.log("Stopping service.")
    dispatchInterface.stopService()
    document.getElementById('label-enable-service').innerHTML = 'off'
}

setNetworks()
// bondNetworks()

/*
    UI Controls
*/

// Main start/stop toggle
const mainSwitch = document.getElementById('enable-service')
mainSwitch.onclick = ()=> {
    if (this.running) {
        windows.disableSocksProxy()
        stopBonding()
        this.running = false
    } else {
        this.running = startBonding()
        if (this.running)
            windows.enableSocksProxy()
    }
}
