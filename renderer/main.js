const {ipcRenderer} = require('electron')
const {createTemporaryInputElement} = require('./utils')

let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')

let targetList = document.getElementById('today')

let listsContainer = document.getElementById('list-names')// li
let itemsContainer = document.getElementById('items') // li

buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

createTemporaryInputElement(buttonAddList, listsContainer, 'addNewList', {el: 'ul', class: 'list-name'}, targetList)
createTemporaryInputElement(buttonAddItem, itemsContainer, 'addNewItem', {el: 'ul', class: 'item-name'}, targetList)

console.log(localStorage)