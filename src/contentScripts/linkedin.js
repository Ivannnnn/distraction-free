const { renderStyles, headReady, currentPathname } = require('./utils')

const rules = {
  newsfeed: `
    .feed-outlet .core-rail > *:not(:first-child) { display:none !important; }
  `
}

let options = {
  newsfeed: false
}

const hideAll = () => {
  return Object.keys(options)
    .map(key => rules[key])
    .join('\n')
}

const showAll = () => ''

const activeOptionsToCSS = () => {
  return Object.keys(options)
    .filter(key => options[key])
    .map(key => rules[key])
    .join('\n')
}

//
// options updated
chrome.storage.onChanged.addListener(changes => {
  changes.options.newValue.linkedin &&
    Object.assign(options, changes.options.newValue.linkedin)
  renderStyles(activeOptionsToCSS())
})

//
// url change
chrome.runtime.onMessage.addListener(() => {
  renderStyles(activeOptionsToCSS())
})

//
// head is inserted & ready to get styles
headReady(() => {
  renderStyles(hideAll())
  chrome.storage.sync.get('options', data => {
    data.options.linkedin && Object.assign(options, data.options.linkedin)
    renderStyles(activeOptionsToCSS())
  })
})
