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
  const promises = videos.map(video => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        if (err) {
          return reject(err)
        }
        resolve(metadata)
      })
    })
  })

  Promise.all(promises)
    .then(results => {
      console.log(results)
    })
})
