const { renderStyles, headReady, currentPathname } = require('./utils')

const rules = {
  newfeed: `
    div[data-testid='primaryColumn'] 
    > div:first-child
    > div:nth-child(4) { display:none; }
  `,
  who_to_follow: `
    div[data-testid=sidebarColumn]
    > div:first-child
    > div:nth-child(2)
    > div:first-child
    > div:first-child
    > div:first-child
    > div:nth-child(4) {
      display:none;
    }
  `,
  trending: 'div[aria-label="Timeline: Trending now"] { display:none; }'
}

let options = {
  newfeed: false,
  growing_communities: false,
  premium: false,
  trending: false,
  recent: false
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
  changes.options.newValue.twitter &&
    Object.assign(options, changes.options.newValue.twitter)
  renderStyles(currentPathname() !== '/home' ? showAll() : activeOptionsToCSS())
})

//
// url change
chrome.runtime.onMessage.addListener(() => {
  currentPathname() === '/home'
    ? renderStyles(activeOptionsToCSS())
    : renderStyles(showAll())
})

//
// head is inserted & ready to get styles
headReady(() => {
  currentPathname() === '/home' && renderStyles(hideAll())
  chrome.storage.sync.get('options', data => {
    data.options.twitter && Object.assign(options, data.options.twitter)
    renderStyles(activeOptionsToCSS())
  })
})
