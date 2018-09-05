const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("path")
let win 

createMainWindow = () => {
    win = new BrowserWindow({frame: false, width: 1000, height: 800, minWidth: 300, minHeight: 600})

    win.loadFile(path.resolve(__dirname, './renderer/index.html'))
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