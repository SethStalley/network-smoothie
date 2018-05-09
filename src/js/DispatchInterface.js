'use strict'

var HttpProxy, Logger, SocksProxy, crypto, inspect, logger, os, pkg, program, 
  splice = [].splice

os = require('os')

inspect = require('util')

crypto = require('crypto')

program = require('commander')

SocksProxy = require('../../lib/dispatch-proxy/lib/proxy/socks')

/*
    Wrapper for https://github.com/Morhaus/dispatch-proxy
*/
module.exports = class DispatchInterface {

    constructor() {
        const signals = os.constants.signals
        this.socksProxy = null
        this.running = false
    }

    getNetworkAdapters() {
        var address, addrs, family, i, interfaces, len, name, opts, results; 
        interfaces = os.networkInterfaces(); 
        results = []; 
        for (name in interfaces) {
            addrs = interfaces[name]; 

     
            let internal = false
            let adapter =  {
                'name':name,
            }

            for (i = 0, len = addrs.length; i < len && addrs; i ++) {
                ( {address, family, internal} = addrs[i]);
                adapter.address = address
            }

            if (!internal)
                results.push(adapter); 
        }
        return results; 
    }

    startSocks(addresses) {
        this.running = true

        const port = 1080
        const host = 'localhost'
        const proxy = new SocksProxy(addresses, port, host)
        
        let ins = this

        proxy.on('request', function({serverConnection, clientConnection, host, port, localAddress}) {
            
            //stop service if it's not longer enabled
            if (ins.running !== true) {
                proxy.stop()
                return
            }

            var id;
            id = (crypto.randomBytes(3)).toString('hex')
            console.log('request', `[${id}] <a>${host}</><b>:${port}</>`)
            console.log('dispatch', `[${id}] <a>${localAddress}</>`)

            serverConnection
                .on('connect', function() {
                    return console.log('connect', `[${id}] <a>${host}</><b>:${port}</>`)
                })
                .on('error', function(err) {
                    return console.log('error', `[${id}] serverConnection\n${escape(err.stack)}`)
                })
                .on('end', function() {
                    return console.log('end', `[${id}] serverConnection`)
                })

            return clientConnection
                .on('error', function(err) {
                    console.log('error', `[${id}] clientConnection\n${escape(err.stack)}`)
                    return err
                })
                .on('end', function() {
                    console.log('end', `[${id}] clientConnection`)
                    return
                })
        })
        .on('error', function(err) {
            console.log('error', `server\n${escape(err.stack)}`)
            return 'error'
        })
        .on('socksError', function(err) {
            console.log('stackerror', `socks\n${escape(err.message)}`)
            return 'stackerror'
        })
    }

    stop() {
        this.running = false
    }

}
