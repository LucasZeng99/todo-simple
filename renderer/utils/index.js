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


module.exports = {
  addListenersByClass,
}