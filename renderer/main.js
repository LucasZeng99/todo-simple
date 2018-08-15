const path = require('path')
const {ipcRenderer, remote} = require('electron')

let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')
let targetList = document.getElementById('today')

let listsContainer = document.getElementById('list-names')// ul

buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

buttonAddList.addEventListener('click', () => {
  let inputElement = document.createElement("input")

  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      ipcRenderer.send('addNewList', inputElement.value)
      // inserting one more list ul.
      let newList = document.createElement('ul')
      newList.classList.add('list-name')
      newList.id = inputElement.value
      newList.textContent = inputElement.value
      listsContainer.appendChild(newList)

      // destruct input element
      inputElement.remove()
    }
  })

  buttonAddList.insertAdjacentElement('beforebegin', inputElement)
})
