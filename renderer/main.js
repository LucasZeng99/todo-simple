const {ipcRenderer} = require('electron')

// element targeting
let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')

// app operations
buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

// lists and items container array targeting
let listsContainer = document.getElementById('list-names')// li
let itemsContainer = document.getElementById('items') // li

/**
 * 
 * TODO: replace item id with a counter.
 * 
 */
// helper functions (independant)
let createItem = (val, id) => {
  let newItemContainer = document.createElement('ul')
  newItemContainer.id = 'item-' + id
  newItemContainer.classList.add('item-container')
  let newItem = document.createElement('input')
      newItem.value = val
      newItem.classList.add('item')
      // listeners for every item of a list.
      newItem.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
          newItem.blur()
        }
      })
      newItem.addEventListener('blur', e => {
        if (newItem.value.length < 1) {
          newItemContainer.remove()
        }
        storeCurrentList()
      })
  let finishBox = document.createElement('div')
      finishBox.classList.add('finishBox')
      finishBox.textContent = 'done'
      finishBox.addEventListener('click', e => {
        if (newItem.style.textDecoration === 'line-through') {
          newItem.style.textDecoration = 'none'
        }
        else newItem.style.textDecoration = 'line-through'
      })
  let deleteBox = document.createElement('div')
      deleteBox.classList.add('deleteBox')
      deleteBox.textContent = 'X'
      deleteBox.addEventListener('click', e => {
        newItemContainer.remove()
        storeCurrentList()
      })
  newItemContainer.appendChild(newItem)
  newItemContainer.appendChild(finishBox)
  newItemContainer.appendChild(deleteBox)

  newItemContainer.addEventListener('click', e => {
    if (newItem.style.textDecoration === 'line-through') {
      finishBox.textContent = 'undo'
      finishBox.style.backgroundColor = '#808080'
    } else {
      finishBox.textContent = 'done'
      finishBox.style.backgroundColor = '#90ee90'
    }
    deleteBox.style.display = 'block'
  })
  // newItemContainer.addEventListener('mouseleave', e => {
  //   finishBox.style.display = 'none'
  //   deleteBox.style.display = 'none'
  // })
  return newItemContainer
}
let createList = (val, id) => {
  let newList = document.createElement('ul')
  newList.classList.add('list-name')
  newList.id = 'list-' + id
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
    itemsArray.push(item.value)
  }
  localStorage.setItem(targetList.textContent, JSON.stringify(itemsArray))
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
  let items = localStorage.getItem(targetList.textContent)
  items = JSON.parse(items)
  if (items !== null) {
    // push to item containers for this targetlist.
    items.forEach((itemId, index) => {
      let newItem = createItem(itemId, index)
      itemsContainer.appendChild(newItem)
    })
  }
}

/**
 * dependent on `createList()`, `listsContainer`, `targetList`
 */
let fetchList = () => {
  let lists = Object.keys(localStorage)

  // remove all list to avoid repetance
  while (listsContainer.firstChild) {
    listsContainer.removeChild(listsContainer.firstChild)
  }

  // push all list to list container
  lists.forEach((listId, index) => {
    let newList = createList(listId, index)
    listsContainer.appendChild(newList)
  })

  // check for 'today' existence
  if (!lists.includes('today')) {
    let todayList = createList('today', '0')
    listsContainer.appendChild(todayList)
  }

  // default list target to today
  let defaultListTarget = document.getElementById('list-0')
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
      let newList = createList(inputElement.value, listsContainer.childElementCount)
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
      let newItem = createItem(inputElement.value, itemsContainer.childElementCount)
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