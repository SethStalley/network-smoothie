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
    const addresses = dispatchInterface.getNetworkAdapters()
    if (addresses) {
        let priorityAddresses = []
        for (let i=0; i<addresses.length; i++) {
            priorityAddresses.push({
                'address': addresses[i].address,
                'priority': 1
            })
        }

        console.log(priorityAddresses)

        dispatchInterface.startSocks(priorityAddresses)
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
    dispatchInterface.stop()
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
        this.running = true
        startBonding()
        windows.enableSocksProxy()
    }
}
