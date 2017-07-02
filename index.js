const electron = require('electron')
const ffmpeg = require('fluent-ffmpeg')

const {
  app,
  BrowserWindow,
  ipcMain
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

ipcMain.on('videos:added', (event, videos) => {
  const promise = new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videos[0].path, (err, metadata) => {
      if (err) {
        return reject(err)
      }
      resolve(metadata)
    })
  })

  promise.then(metadata => console.log(metadata))
})
