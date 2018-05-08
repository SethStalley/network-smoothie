'use strict'

const DispatchInterface = require('./DispatchInterface')
const dispatchInterface = new DispatchInterface()

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
    dispatchInterface.startSocks(address)
}

setNetworks()
// bondNetworks()
