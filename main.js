'use strict'

const electron = require('electron')
const app = electron.app  // Module to control application life.
const dialog = electron.dialog
const BrowserWindow = electron.BrowserWindow  // Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null,
  subWindow = null,
  fs = require('fs'),
  globalShortcut = require('global-shortcut'),
  clipboard = require('electron').clipboard,
  ipc = require('electron').ipcMain
  
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  })
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  
  fs.readFile('yixunfe_toolbox.config', 'utf-8', function (err, data) {
    if (err) {
      
    } else {
      //console.log(typeof data)
      
      // and load the index.html of the app.
      mainWindow.loadURL('file://' + __dirname + '/index.html')

      // Open the DevTools.
      mainWindow.webContents.openDevTools()
      
      mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('config', data)
      })
    }
  })
  
  ipc.on('run-build', function (e, d) {
    var exec = require('child_process').exec, child
    child = exec(d.cmd, {cwd: d.cwd}, function(e, stdout, stderr) {
  　　if(!e) {
　　　　if (stdout) {
          mainWindow.webContents.send('task-build-done', stdout)
        } else {
          mainWindow.webContents.send('task-build-fail', stderr)
        }
  　　} else {
        mainWindow.webContents.send('task-build-systemError', e)
      }
    })
  })
  
  ipc.on('write-config', function (e, str) {
    fs.open('yixunfe_toolbox.config', 'w', function  (err, fd) {
      fs.write(fd, str, function (err, data) {
        if (err) {
          mainWindow.webContents.send('save-config-fail')
        } else {
          mainWindow.webContents.send('save-config-success')
        }
      })
    })
  })
  
  ipc.on('copy-text', function (e, str) {
    clipboard.writeText(String(str))
  })
});