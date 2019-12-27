const createElem = html => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.firstChild
}

const distractionFree = bool => {
  bool
    ? document.head.appendChild(
        createElem(`<style class='extension-css'>
            ._1FUNcfOeszr8eruqLxCMcR,
            .rpBJOHq2PR60pnwJlUyP0,
            ._3tBFh6Ty3gSaxW4gcm6hZ_ {
              visibility:hidden;
            }
          </style>`
        )
      )
    : document.head.removeChild(document.head.querySelector('.extension-css'))
}


chrome.storage.sync.get(['reddit'], ({ reddit }) => {
  distractionFree(reddit)
})

chrome.storage.onChanged.addListener(({ reddit }) => {
  distractionFree(reddit.newValue)
})

