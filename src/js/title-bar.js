'use strict'

var remote = require('electron').remote
const Windowbar = require('../../lib/windowbar/src/index')
const WindowsProxy = require('./WindowsProxy')

var mainWindow = remote.getCurrentWindow()
const windows = new WindowsProxy()

const isMac = process.platform === 'darwin'
const style = isMac ? 'mac' : 'windows';

var t = new Windowbar({'style':'style', 'dark':true, 'dragable':true, 'dblClickable':true})

t.appendTo(document.getElementById('title-bar'))

t.on('minimize', function(e) {
	mainWindow.minimize()
});

t.on('close', function(e) {
	windows.disableSocksProxy()
	mainWindow.close()
});

// t.element exposes the root dom element
t.element.appendChild(document.createElement('div'))

// Clean up after usage
t.destroy()
