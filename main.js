const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let windows = [];

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});
  windows.push(mainWindow);
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    for(var i = windows.length - 1; i >= 0; i--) {
      if(windows[i] === mainWindow) {
         windows.splice(i, 1);
      }
    }
    mainWindow = null;
  });
}

const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files);
  });
});

ipc.on('clean-dir-entries', function (event, currentDir, files) {
  const fs = require('fs');
  const IGNORE_EXT = ["7z", "php", "rar", "exe", "bat", "js", "htm", "html", "zip"];
  var cleaned = [];
  var i = 0;
  function testFile(err, file) {
    if(file.isFile()) {
      var file_name = files[i];
      ext = file_name.split('.');
      ext = ext[ext.length-1];
      if (file[0]!=='.' && file[0]!=='$' && !IGNORE_EXT.includes(ext)) {
        cleaned.push(file_name);
      }
    }
    i++;
    if(i<files.length) {
      fs.stat(currentDir+'/'+files[i], testFile);
    } else {
      event.sender.send('entry-cleaned', cleaned);
    }
  }
  fs.stat(currentDir+'/'+files[0], testFile);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.