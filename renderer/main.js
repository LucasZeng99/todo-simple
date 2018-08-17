// const {ipcRenderer} = require('electron')

// element targeting
let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')

// app operations
// buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
// buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

// lists and items container array targeting
let listsContainer = document.getElementById('list-names')// li
let itemsContainer = document.getElementById('items') // li

/**
 * 
 * TODO: replace item id with a counter.
 * 
 */

// helper functions (independant)
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
let createList = (val) => {
  let newList = document.createElement('ul')
    newList.classList.add('list-name')
    newList.id = val
    newList.textContent = val
    newList.addEventListener('click', () => {
      changeTarget(newList)
    })
    return newList
} // **warning** dependent on changeTarget()
// updating functions
let storeCurrentList = () => {
  // create object to be stored.
  let items = document.getElementsByClassName('item')
  let itemsArray = []
  for (item of items) {
    itemsArray.push(item.id)
  }
  localStorage.setItem(targetList.id, JSON.stringify(itemsArray))
}

/**
 * 
 * @param {} newTargetElement 
 * dependent on `fetchItems()` and `itemsContainer`
 */
let changeTarget = (newTargetElement) => {
  targetList.classList.remove('chosen-list')
  targetList = newTargetElement
  targetList.classList.add('chosen-list')
  // remove all current items of the old list
  while (itemsContainer.firstChild) {
    itemsContainer.removeChild(itemsContainer.firstChild)
  }
  fetchItems()

  // remove all input elements
  let inputElements = document.getElementsByClassName('input')
  console.log(inputElements)
  for (let el of inputElements) {
    el.blur()
  }
}

// initialize functions
/**
 * dependent on `createItem()` and `itemsContainer`.
 */
let fetchItems = () => {
  let items = localStorage.getItem(targetList.id)
  items = JSON.parse(items)
  if (items !== null) {
    for (let itemId of items) {
      let newItem = createItem(itemId)
      itemsContainer.appendChild(newItem)
    } // push to item containers for this targetlist.
  }
}

/**
 * dependent on `createList()`, `listsContainer`, `targetList`
 */
let fetchList = () => {
  let lists = Object.keys(localStorage)
  console.log(`lists: ${lists}`)

  // remove all list to avoid repetance
  while (listsContainer.firstChild) {
    listsContainer.removeChild(listsContainer.firstChild)
  }

  // push all list to list container
  for (let listId of lists) {
    let newList = createList(listId)
    listsContainer.appendChild(newList)
  }

  // check for 'today' existence
  if (lists.includes('today')) {
    console.log(`it's in!`)
  } else {
    let todayList = createList('today')
    listsContainer.appendChild(todayList)
  }

  // default list target to today
  let defaultListTarget = document.getElementById('today')
  targetList = defaultListTarget
  targetList.classList.add('chosen-list')
}




fetchList()
fetchItems()


buttonAddList.addEventListener('click', () => {
  let inputElement = document.createElement('input')
  inputElement.className = 'input'
  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // inserting one more list ul.
      let newList = createList(inputElement.value)
      listsContainer.appendChild(newList)
      // change target list to current list
      changeTarget(newList)
      // destruct input element
      inputElement.blur()
      // store to localStorage
      storeCurrentList()
    }
  })

  inputElement.addEventListener('blur', () => {
    inputElement.remove()
  })
  
  buttonAddList.insertAdjacentElement('beforebegin', inputElement)
  inputElement.focus()
})

buttonAddItem.addEventListener('click', () => {
  let inputElement = document.createElement('input')
  inputElement.className = 'input'
  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // inserting one more list ul.
      let newItem = createItem(inputElement.value)
      itemsContainer.appendChild(newItem)
      // destruct input element
      inputElement.blur()
      storeCurrentList()
    }
  })

  inputElement.addEventListener('blur', (event) => {
    inputElement.remove()
  })

  buttonAddItem.insertAdjacentElement('beforebegin', inputElement)
  inputElement.focus()
})

console.log(localStorage)