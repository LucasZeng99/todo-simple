const {ipcRenderer} = require('electron')

// element targeting
let buttonClose = document.getElementById('X')
let buttonMinimize = document.getElementById('_')
let buttonAddList = document.getElementById('list-add')
let buttonAddItem = document.getElementById('item-add')
let buttonToggle = document.getElementsByClassName('todo-menu')[0]
// app operations
buttonClose.addEventListener('click', () => ipcRenderer.send('close'))
buttonMinimize.addEventListener('click', () => ipcRenderer.send('minimize'))

// lists and items container array targeting
let listsContainer = document.getElementById('list-names')// li
let itemsContainer = document.getElementById('items') // li
let sideBar = document.getElementsByClassName('todo-sidebar')[0]
/**
 * 
 * TODO: replace item id with a counter.
 * 
 */
// helper functions (independant)
let createItem = (val, id, finished) => {
  // create an item in a list
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
  // check if this item has been checked as finished.
  if (finished == '1') {
    newItem.style.textDecoration = 'line-through'
  }

  let finishBox = document.createElement('div')
      finishBox.classList.add('finishBox')
      if (newItem.style.textDecoration === 'line-through') {
        finishBox.textContent = '\u{2611}'
        finishBox.style.backgroundColor = '#808080'
      } else {
        finishBox.textContent = '\u{2610}'
        finishBox.style.backgroundColor = '#90ee90'
      }
      finishBox.addEventListener('click', () => {
        if (newItem.style.textDecoration === 'line-through') {
          newItem.style.textDecoration = 'none'
        }
        else newItem.style.textDecoration = 'line-through'

        storeCurrentList()
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
      finishBox.textContent = '\u{2611}'
      finishBox.style.backgroundColor = '#808080'
    } else {
      finishBox.textContent = '\u{2610}'
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

  let newListContainer = document.createElement('ul')
  newListContainer.id = 'list-' + id + '-container'
  newListContainer.classList.add('list-container')
  newListContainer.addEventListener('click', () => {
    changeTarget(newListContainer)
  })

  let newList = document.createElement('p')
  newList.classList.add('list-name')
  newList.id = 'list-' + id
  newList.textContent = val
  
  
  let deleteBox = document.createElement('div')
      deleteBox.classList.add('deleteBox')
      deleteBox.classList.add('list-btn')
      deleteBox.textContent = 'X'
      deleteBox.addEventListener('click', e => {
        newListContainer.remove()
        localStorage.removeItem(newList.textContent)
      })
  newListContainer.appendChild(newList)
  newListContainer.appendChild(deleteBox)
  console.log(newList.textContent)
  return newListContainer
} // **warning** dependent on changeTarget()

// updating functions
let storeCurrentList = () => {
  // create object to be stored.
  let items = document.getElementsByClassName('item')
  let itemsArray = []
  for (item of items) {
    // itemsArray.push(item.value)
    if (item.style.textDecoration === 'line-through') {
      itemsArray.push(item.value + '1') // true if it's done.
    }
    else {
      itemsArray.push(item.value + '0') // 0 if it's not done.
    }
  }
  localStorage.setItem(targetList.firstChild.textContent, JSON.stringify(itemsArray))
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
  for (let el of inputElements) {
    el.blur()
  }
}

// initialize functions
/**
 * dependent on `createItem()` and `itemsContainer`.
 */
let fetchItems = () => {
  let items = localStorage.getItem(targetList.firstChild.textContent)
  items = JSON.parse(items)
  if (items !== null) {
    // push to item containers for this targetlist.
    items.forEach((itemId, index) => {
      let newItem = createItem(itemId.slice(0, -1), index, itemId.slice(-1))
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
  if (lists.length < 1) {
    let todayList = createList('today', '0')
    listsContainer.appendChild(todayList)
  }

  // default list target to today
  let defaultListTarget = document.getElementById('list-0-container')
  targetList = defaultListTarget
  targetList.classList.add('chosen-list')
}




fetchList()
fetchItems()


buttonAddList.addEventListener('click', () => {
  let inputElement = document.createElement('input')
  inputElement.className = 'list-input'
  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // inserting one more list ul.
      if (inputElement.value == '') {
        inputElement.blur()
      }
      else {
        let newList = createList(inputElement.value, listsContainer.childElementCount)
        listsContainer.appendChild(newList)
        // change target list to current list
        changeTarget(newList)
        // destruct input element
        inputElement.blur()
        // store to localStorage
        storeCurrentList()
      }
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
  inputElement.className = 'item-input'
  inputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // inserting one more list ul.
      if (inputElement.value !== '') {
        let content = inputElement.value
        let finished = false
        let newItem = createItem(content, itemsContainer.childElementCount, finished)
        itemsContainer.appendChild(newItem)
        // destruct input element
        inputElement.blur()
        storeCurrentList()
      }
      inputElement.blur()
    }
  })

  inputElement.addEventListener('blur', (event) => {
    inputElement.remove()
  })

  buttonAddItem.insertAdjacentElement('beforebegin', inputElement)
  inputElement.focus()
})

buttonToggle.addEventListener('click', () => {
  // console.log(sideBar.className)
  if (sideBar.classList.contains('toggle-open')) {
    sideBar.classList = ['todo-sidebar']
    console.log('to close')
  }
  else {
    sideBar.classList.add('toggle-open')
    console.log('to open')
  }
})
// console.log(localStorage)