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

ipcMain.on('minimize', () => {
    if (win !== null) {
        win.minimize()
    }
})

ipcMain.on('addNewList', (event, listName, targetListId) => {
    console.log(`adding new list: ${listName}, target: ${targetListId}`)
})
ipcMain.on('addNewItem', (event, listName, targetListId) => {
    console.log(`adding new item: ${listName}, target: ${targetListId}`)
})

app.on('ready', createMainWindow)