const {
  renderStyles,
  headReady,
  currentPathname,
  onUrlChange,
  arrGetRandom,
  appendHTML,
  $,
  observe
} = require('./utils')

const onPageUpdated = cb =>
  observe(document.getElementById('content'), mutations => {
    if (mutations[0].addedNodes.length === 2) {
      cb()
      return false
    }
  })

const onContentReady = cb =>
  observe(document.documentElement, mutations => {
    if (mutations.length === 4) {
      cb()
      return false
    }
  })

//
// What about ads
const rules = {
  newsfeed: bool => {
    if (bool) {
      console.log('run')
      const run = () => {
        const lis = `<ul><li>${arrGetRandom(socialMediaFacts, 4).join(
          '</li><li>'
        )}</li></ul>`

        setTimeout(() => appendHTML($('#contentArea > div')[0], lis), 100)
      }
      $('#contentArea')[0] ? run() : onContentReady(run)
    }

    return (
      bool &&
      `
      #contentArea
        > div
        > div:not(#pagelet_composer) {
          display:none;
        }
      #contentArea li {
        background-color: #fff;
        border: 1px solid #dddfe2;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 12px;
      }
    `
    )
  },
  group_recommendations: `
    #pagelet_ego_pane { display:none; }
    #pagelet_rhc_footer > div { margin-top:0; }
  `,
  ads: ''
}

//
// What about group recommendations
let options = {
  newsfeed: false,
  group_recommendations: false,
  ads: false
}

const socialMediaFacts = [
  'The average daily time spent on social media is 142 minutes a day.',
  '74% of Facebook users check it every day.',
  'The average user spends 35 minutes on Facebook a day.',
  'There are an estimated 270 million fake Facebook profiles.',
  'Facebook adds 500,000 new users every day; 6 new profiles every second.',
  '79% of all online US adults use Facebook.',
  '30% of Americans get all of their news exclusively from Facebook.',
  'Almost one-quarter – 23% – of Facebook users check the site FIVE TIMES or more per day.',
  'Only 25% of Facebook users bother to check or adjust their privacy settings.'
]

const hideAll = () => {
  return Object.keys(options)
    .map(key => rules[key])
    .join('\n')
}

const showAll = () => ''

const activeOptionsToCSS = () => {
  return Object.keys(options).map(key =>
    typeof rules[key] === 'function'
      ? rules[key](options[key])
      : rules[key] || ''
  )
}

//
// options updated
chrome.storage.onChanged.addListener(changes => {
  changes.options.newValue.facebook &&
    Object.assign(options, changes.options.newValue.facebook)
  renderStyles(currentPathname() !== '/' ? showAll() : activeOptionsToCSS())
})

//
// url change
onUrlChange(() => {
  onPageUpdated(() => {
    renderStyles(currentPathname() === '/' ? activeOptionsToCSS() : showAll())
  })
})

//
// head is inserted & ready to get styles
headReady(() => {
  currentPathname() === '/' && renderStyles(hideAll())
  chrome.storage.sync.get('options', data => {
    data.options.facebook && Object.assign(options, data.options.facebook)
    renderStyles(currentPathname() === '/' ? activeOptionsToCSS() : showAll())
  })
})
