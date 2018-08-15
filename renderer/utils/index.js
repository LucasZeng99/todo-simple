/**
 * 
 * @param {String} className element target from class
 * @param {String} event event for the target
 * @param {Function} fn function listener
 */
let addListenersByClass = (className, event, fn) => {
  let el = document.getElementsByClassName(className)
  if (el == null) return false

  for (one of el) {
    one.addEventListener(event, fn)
  }
  return true
}

let createTemporaryInputElement = (buttonElement, containerElement, ipcMsg='addNewList', options={el: 'ul', class: 'list-name'}, targetList) => {
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
module.exports = {
  addListenersByClass,
  createTemporaryInputElement
}