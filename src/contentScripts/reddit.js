const { renderStyles, headReady, currentPathname } = require('./utils')

//
// TO-DO advertisment, ads & premium
const rules = {
  newfeed: `
    .scrollerItem,
    #SHORTCUT_FOCUSABLE_DIV
      > div:nth-child(4)
      > div
      > div
      > div
      > div:nth-child(2)
      > div:nth-child(2) {
      display: none;
    }
  `,
  growing_communities: '._160axjzy-Hx7ANXMr87Rbe { display:none; }',
  premium: '._1b1Jalg2nxA_Z-BjKXRfAV { display:none; }',
  trending: '._2j6XpwwZyn7dNcfH7Blz0B { display:none; }',
  recent: '._3Im6OD67aKo33nql4FpSp_ { display:none; }'
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
  changes.options.newValue.reddit &&
    Object.assign(options, changes.options.newValue.reddit)
  renderStyles(currentPathname() !== '/' ? showAll() : activeOptionsToCSS())
})

//
// url change
chrome.runtime.onMessage.addListener(() => {
  currentPathname() === '/'
    ? renderStyles(activeOptionsToCSS())
    : renderStyles(showAll())
})

//
// head is inserted & ready to get styles
headReady(() => {
  currentPathname() === '/' && renderStyles(hideAll())
  chrome.storage.sync.get('options', data => {
    data.options.reddit && Object.assign(options, data.options.reddit)
    renderStyles(activeOptionsToCSS())
  })
})
