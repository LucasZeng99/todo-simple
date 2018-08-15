const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("path")
let win 

createMainWindow = () => {
    win = new BrowserWindow({width: 800, height: 600, frame: false})

    win.loadFile(path.resolve(__dirname, './renderer/index.html'))
    win.webContents.openDevTools()
    win.on('closed', () => {
        app.quit()
    })
}

ipcMain.on('close', () => {
    app.quit()
})

app.on('ready', createMainWindow)
