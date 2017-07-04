const path = require('path')
const electron = require('electron')
const ffmpeg = require('fluent-ffmpeg')
const _ = require('lodash')

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
        resolve(Object.assign({}, video, {
          duration: metadata.format.duration,
          format: 'avi'
        }))
      })
    })
  })

  Promise.all(promises)
    .then(results => {
      mainWindow.webContents.send('metadata:complete', results)
    })
})

ipcMain.on('conversion:start', (event, videos) => {
  _.each(videos, video => {
    const parts = path.parse(video.path)
    const outputPath = `${parts.dir}/${parts.name}.${video.format}`

    ffmpeg(video.path)
      .output(outputPath)
      .on('end', () => console.log('Video conversion complete.'))
      .run()
  })
})
