const createElem = html => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.firstChild
}

const distractionFree = bool => {
  bool
    ? document.head.appendChild(
        createElem(`<style class='extension-css'>
            div[data-testid="primaryColumn"] > div,
            div[aria-label="Timeline: Trending now"],
            aside[aria-label="Who to follow"],
            .r-1u4rsef {
              display:none;
            }
          </style>`
        )
      )
    : document.head.removeChild(document.head.querySelector('.extension-css'))
}


chrome.storage.sync.get(['twitter'], ({ twitter }) => {
  distractionFree(twitter)
})

chrome.storage.onChanged.addListener(({ twitter }) => {
  distractionFree(twitter.newValue)
})
