'use strict'

const regedit = require('regedit')
const shell = require('node-powershell')

module.exports = class WindowsProxy {

    constructor() {
        this.host = 'localhost'
        this.port = '1080'

        // Powershell script to refresh windows proxy settings. 
        // Here as a string because relative paths don't play well with `node-powershell` & electron packages.
        this.refresh_ps = `
                        $signature = '[DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int dwBufferLength);'
                        $INTERNET_OPTION_REFRESH            = 37
                        $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
                        $type::InternetSetOption(0, $INTERNET_OPTION_REFRESH, 0, 0)`
    }

    _refreshIE(callback=null) {
        const ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
        })

        ps.addCommand(this.refresh_ps);

        ps.invoke()
        .then(output => {
            console.log(output)
            ps.dispose()
            if (callback)
                callback()
        })
        .catch(err => {
            console.log(err)
            ps.dispose()
            if (callback)
                callback()
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
        
            ins._refreshIE(callback)
        })
    }

    enableSocksProxy() {
        const ins = this
        let values = this._formRegistryObj(1)

        regedit.putValue(values, function(err) {
            if (err)
                console.log(`Failed to enable proxy in registry`, err)
            
            ins._refreshIE()
        })
    }
}
