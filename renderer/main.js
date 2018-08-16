const {ipcRenderer} = require('electron')

let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')

// options for the app
buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

let targetList = document.getElementById('today')

let listsContainer = document.getElementById('list-names')// li
let itemsContainer = document.getElementById('items') // li

console.log(Object.keys(localStorage))
let createItem = (val) => {
  let newItem = document.createElement('ul')
      newItem.classList.add('item')
      newItem.id = val
      newItem.textContent = val

      // listeners for every item of a list.
      newItem.addEventListener('mouseup', e => {
        if (e.button === 2) { // a right click.
          newItem.remove() // remove the item
          storeCurrentList()
        }
      })
  return newItem
}
let storeCurrentList = () => {
  // create object to be stored.
  let items = document.getElementsByClassName('item')
  let itemsArray = []
  for (item of items) {
    itemsArray.push(item.id)
  }
  localStorage.setItem(targetList.id, JSON.stringify(itemsArray))
}

let changeTarget = (newTargetElement) => {
  targetList = newTargetElement

  // remove all current items of the old list
  while (itemsContainer.firstChild) {
    itemsContainer.removeChild(itemsContainer.firstChild)
  }

  // fetch previous items from local storage
  itemsStringFromLocalStorage = localStorage.getItem(targetList.id)
  let itemsArray = JSON.parse(itemsStringFromLocalStorage)
  if (itemsArray !== null) {
    let childs = itemsArray.map(item => {
      let x = createItem(item)
      return x
    })
    for (let item of childs) {
      itemsContainer.appendChild(item)
    }
  }
  
}
let fetchItems = () => {
  let items = localStorage.getItem(targetList.id)
  items = JSON.parse(items)
  for (let itemId of items) {
    let newItem = createItem(itemId)
    itemsContainer.appendChild(newItem)
  }
}
let fetchList = () => {
  let lists = Object.keys(localStorage)
  // remove all list to avoid repetance
  while (listsContainer.firstChild) {
    listsContainer.removeChild(listsContainer.firstChild)
  }
  for (let listId of lists) {
    let newList = document.createElement('ul')
    newList.classList.add('list-name')
    newList.id = listId
    newList.textContent = listId
    newList.addEventListener('click', () => {
      changeTarget(newList)
    })    
    // append this child to the list of lists.
    listsContainer.appendChild(newList)
  }
}

fetchList()
fetchItems()

buttonAddList.addEventListener('click', () => {
  let inputElement = document.createElement('input')
  inputElement.className = 'input'
  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // inserting one more list ul.
      let newList = document.createElement('ul')
      newList.classList.add('list-name')
      newList.id = inputElement.value
      newList.textContent = inputElement.value
      newList.addEventListener('click', () => {
        changeTarget(newList)
      })
      // append this child to the list of lists.
      listsContainer.appendChild(newList)
      
      // change target list to current list
      changeTarget(newList)
      // destruct input element
      inputElement.remove()
      // store everything in this list to localStorage
      // TODO: check for repetitive naming
      storeCurrentList()
    }
  })
  buttonAddList.insertAdjacentElement('beforebegin', inputElement)
})

buttonAddItem.addEventListener('click', () => {
  let inputElement = document.createElement('input')
  inputElement.className = 'input'
  inputElement.focus()
  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // inserting one more list ul.
      let newItem = createItem(inputElement.value)
      itemsContainer.appendChild(newItem)
      // destruct input element
      inputElement.remove()
      storeCurrentList()
    }
  })
  buttonAddItem.insertAdjacentElement('beforebegin', inputElement)
})

console.log(localStorage)