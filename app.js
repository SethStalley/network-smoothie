'use strict'


const electron = require('electron')
const autoUpdater = require('electron-updater').autoUpdater

// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain

// Module to create native browser window.
const BrowserWindow =  electron.BrowserWindow
const isMac = process.platform === 'darwin'

const path = require('path')
const url = require('url')
const WindowsProxy = require('./src/js/WindowsProxy')

const windows = new WindowsProxy()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    backgroundColor: '#2f3241',
    width: 350, 
    height: 600,
    resizable: false,
    frame: isMac,
    show: false,
  })

  if (process.env.NODE_ENV === 'dev') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', ()=> {
    mainWindow.show()
    autoUpdater.checkForUpdates()
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null    
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac) {
    windows.disableSocksProxy(() => app.quit())
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
})
