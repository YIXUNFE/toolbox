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
  ipc = require('electron').ipcMain,
  nativeImage = require('electron').nativeImage,
  weinre = null,
  proxy = null
  
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
    resizable: false,
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
  
  ipc.on('run-weinre', function (e, d) {
    var processor = require('child_process'),
      fork = processor.fork
    weinre = fork('./node_modules/weinre/weinre', ['--boundHost', d.ip, '--httpPort', d.port], {cwd: __dirname})
    mainWindow.webContents.send('weinre-on')
  })
  
  ipc.on('shutdown-weinre', function (e, d) {
    //console.log(weinre.pid)
    if (weinre) {weinre.kill()}
    //console.log(weinre.pid)
    //if (weinre) {
    //  require('child_process').exec('taskkill -PID ' + weinre.pid + '-F')
    //}
    mainWindow.webContents.send('weinre-off')
  })
  
  ipc.on('open-browser', function (e, d) {
    var processor = require('child_process'),
      exec = processor.exec
    exec('explorer ' + d)
  })
  
  ipc.on('open-proxy', function (e, d) {
    var processor = require('child_process'),
      fork = processor.fork
    proxy = fork('./node_modules/proxy', [d], {cwd: __dirname})
    mainWindow.webContents.send('proxy-on')
  })
  
  ipc.on('shutdown-proxy', function (e, d) {
    if (proxy) {proxy.kill()}
    mainWindow.webContents.send('proxy-off')
  })
  
  ipc.on('open-proxy-force', function (e, d) {
    var processor = require('child_process'),
      fork = processor.fork
    if (proxy) {proxy.kill()}
    proxy = fork('./node_modules/proxy', [d], {cwd: __dirname})
    mainWindow.webContents.send('proxy-on')
  })
  
  ipc.on('trace-ip', function () {
    var ip = require('ip')
    mainWindow.webContents.send('trace-ip', ip.get())
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
  
  ipc.on('save-qrcode', function (err, base64Str) {
    dialog.showSaveDialog({title: '请选择保存路径', defaultPath: 'C:/', filters: [
      { name: 'Images', extensions: ['png'] }
    ]}, function (p) {
      var img = nativeImage.createFromDataURL(base64Str)
      fs.writeFile(p, img.toPng())
    })
  })
});