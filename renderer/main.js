const path = require('path')
const remote = require('electron').remote

document.getElementsByClassName('X')[0].addEventListener('click', () => {
  let win = remote.getCurrentWindow()
  win.close()
})

document.getElementsByClassName('_')[0].addEventListener('click', () => {
  let win = remote.getCurrentWindow()
  win.minimize()
})