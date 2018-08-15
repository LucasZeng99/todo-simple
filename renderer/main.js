const {ipcRenderer} = require('electron')

let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')

localStorage.clear()
let targetList = document.getElementById('today')
let today = targetList

let listsContainer = document.getElementById('list-names')// li
let itemsContainer = document.getElementById('items') // li

today.addEventListener('click', () => {
  changeTarget(today)
})

buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

buttonAddList.addEventListener('click', () => {
  let inputElement = document.createElement('input')

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

  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // inserting one more list ul.
      let newList = document.createElement('ul')
      newList.classList.add('item')
      newList.id = inputElement.value
      newList.textContent = inputElement.value

      itemsContainer.appendChild(newList)
      // destruct input element
      inputElement.remove()
      storeCurrentList()
    }
  })
  buttonAddItem.insertAdjacentElement('beforebegin', inputElement)
})


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
      let x = document.createElement('ul')
      x.id = item
      x.innerText = item
      x.className = 'item'
      return x
    })
    for (let item of childs) {
      itemsContainer.appendChild(item)
    }
  }
  
}
console.log(localStorage)