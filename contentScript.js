const renderStyles = (() => {
  const style = document.createElement('style')
  return css => {
    style.innerHTML = css
    if (!style.parentElement) document.head.appendChild(style)
  }
})()



/*
const mapRules = {
  'reddit.com': `
  ._1FUNcfOeszr8eruqLxCMcR,
  .rpBJOHq2PR60pnwJlUyP0,
  ._3tBFh6Ty3gSaxW4gcm6hZ_ {
    visibility:hidden;
  }
  `,
  'twitter.com': `
  div[data-testid="primaryColumn"] > div,
  div[aria-label="Timeline: Trending now"],
  aside[aria-label="Who to follow"],
  .r-1u4rsef {
    visibility:hidden;
  }
  `
}
*/


const css = {
  'reddit.com': {
    posts: '.rpBJOHq2PR60pnwJlUyP0',
    growing_communities: '._3RPJ8hHnfFohktLZca18J6',
    premium: '._1G4yU68P50vRZ4USXfaceV',
    trending: '._2j6XpwwZyn7dNcfH7Blz0B',
    recent: '._3Im6OD67aKo33nql4FpSp_'
  }
}


const options = {
  'reddit.com': {
    posts: false,
    growing_communities: false,
    premium: false,
    trending: false,
    recent: false,
  }
}


const mapOptionsToCSS = host => {
  const cssArr = []
  Object.keys(css[host]).forEach(option => {
    cssArr.push(css[host][option] + ` { visibility: ${options[host][option] ? 'hidden' : 'visible'}; }`)
  })
  return cssArr.join('\n')
}


//
// runs on 
document.addEventListener('DOMContentLoaded', () => {
  renderStyles(
    mapOptionsToCSS(window.location.host.replace(/^www\./, ''))
  )
})


// 
// runs on url or options change
chrome.runtime.onMessage.addListener(() => {
  //renderStyles(mapRules[window.location.host.replace(/^www\./, '')])

  
})