'use strict'

import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  session
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9090`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// signout event
ipcMain.on('signout', (event, arg) => {
  session.defaultSession.clearCache((error) => {
    if (error) console.error(error)
  })
  session.defaultSession.clearStorageData()
})

// exit event
ipcMain.on('exit', function (event, arg) {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Yes', 'Cancel'],
    title: 'Closing Astrolabe',
    cancelId: 99,
    message: 'Are you sure you want close Astrolabe?'
  }, function (response) {
    console.log('Exit: ' + response)
    if (!response) {
      app.quit()
    }
  })
})
