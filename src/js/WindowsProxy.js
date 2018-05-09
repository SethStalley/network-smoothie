'use strict'

const regedit = require('regedit')
const shell = require('node-powershell')

module.exports = class WindowsProxy {

    constructor() {
        this.host = 'localhost'
        this.port = '1080'
    }

    _refreshIE() {
        const ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
        })

        ps.addCommand('./lib/powershell/refreshIE.ps1');

        ps.invoke()
        .then(output => {
            console.log(output)
        })
        .catch(err => {
            console.log(err)
            ps.dispose()
        });
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

    disableSocksProxy(callback=null) {
        const ins = this
        let values = this._formRegistryObj(0)
    
        regedit.putValue(values, function(err) {
            if (err)
                console.log(`Failed to disable proxy in registry`, err)
        
            ins._refreshIE()
            if (callback)
                callback()
        })
    }

    enableSocksProxy() {
        const ins = this
        let values = this._formRegistryObj(1)

        console.log(values)
        regedit.putValue(values, function(err) {
            if (err)
                console.log(`Failed to enable proxy in registry`, err)
            
            ins._refreshIE()
        })
    }
}
