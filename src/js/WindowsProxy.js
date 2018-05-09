'use strict'

const windows = require('windows')
const regedit = require('regedit')

module.exports = class WindowsProxy {

    constructor() {
        this.host = 'localhost'
        this.port = '1080'
    }

    _formRegistryObj(proxyEnable, host=this.host, port=this.port) {
        const registryKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings'
        const values = { [registryKey] : {
                'ProxyEnable' : {
                    value: proxyEnable,
                    type: 'REG_DWORD'
                },
                'ProxyOverride': {
                    value: '<local>',
                    type: 'REG_SZ'
                },
                'ProxyServer' : {
                    value: `socks=${host}:${port}`,
                    type: 'REG_SZ'
                }
            }
        }

        return values
    }

    disableSocksProxy() {
        let values = this._formRegistryObj(0)

        regedit.putValue(values, function(err) {
            if (err)
                console.log(`Failed to disable proxy in registry`, err)
        })
    }

    enableSocksProxy() {
        let values = this._formRegistryObj(1)

        console.log(values)
        regedit.putValue(values, function(err) {
            if (err)
                console.log(`Failed to enable proxy in registry`, err)
        })
    }
}
