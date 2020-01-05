const { renderStyles, headReady } = require('./utils')

const rules = {
  recommended: `
  ytd-two-column-browse-results-renderer[page-subtype=home] { display:none !important; }
  `,
  up_next: `ytd-watch-next-secondary-results-renderer { display: none !important; }`,
  related: `.videowall-endscreen { display: none !important }`,
  comments: `#watch-discussion, #comments { display: none; }`,
  ads: `#player-ads { display:none !important; }`
}

//
// sidebar ads maybe
let options = {
  recommended: false,
  up_next: false,
  related: false,
  comments: false,
  ads: false
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
  changes.options.newValue.youtube &&
    Object.assign(options, changes.options.newValue.youtube)
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
    data.options.youtube && Object.assign(options, data.options.youtube)
    renderStyles(activeOptionsToCSS())
  })
})
