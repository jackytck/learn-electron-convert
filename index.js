const electron = require('electron')

const {
  app,
  BrowserWindow
} = electron

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { backgroundThrottling: false }
  })

  mainWindow.loadURL(`file://${__dirname}/src/index.html`)
})
