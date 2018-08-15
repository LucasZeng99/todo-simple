const path = require('path')
const {ipcRenderer, remote} = require('electron')

let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')

let targetList = document.getElementById('today')

let listsContainer = document.getElementById('list-names')// li
let itemsContainer = document.getElementById('items') // li

buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

let createTemporaryImputElement = (buttonElement, containerElement, ipcMsg='addNewList', options={el: 'ul', class: 'list-name'}) => {
  buttonElement.addEventListener('click', () => {
    let inputElement = document.createElement('input')

    inputElement.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        ipcRenderer.send(ipcMsg, inputElement.value, targetList.id)
        // inserting one more list ul.
        let newList = document.createElement(options.el)
        newList.classList.add(options.class)
        newList.id = inputElement.value
        newList.textContent = inputElement.value

        containerElement.appendChild(newList)
  
        // destruct input element
        inputElement.remove()
      }
    })
  
    buttonElement.insertAdjacentElement('beforebegin', inputElement)
  })
}
createTemporaryImputElement(buttonAddList, listsContainer, 'addNewList', {el: 'ul', class: 'list-name'})
createTemporaryImputElement(buttonAddItem, itemsContainer, 'addNewItem', {el: 'ul', class: 'item-name'})

