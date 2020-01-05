const renderStyles = (() => {
  const style = document.createElement('style')
  return css => {
    style.innerHTML = css
    if (!style.parentElement) document.head.appendChild(style)
  }
})()

const headReady = readyCb => {
  const headCheck = mutations => {
    for (let i = 0; i < mutations.length; i++) {
      const $head = Array.from(mutations[i].addedNodes).find(
        el => el.tagName === 'HEAD'
      )

      if ($head) {
        mutationObserver.disconnect()
        return readyCb()
      }
    }
  }

  const mutationObserver = new MutationObserver(headCheck)
  mutationObserver.observe(document.documentElement, { childList: true })
}

const currentPathname = () => new URL(window.location.href).pathname

const onUrlChange = (() => {
  let pageLoaded = false
  const subscribers = []

  chrome.runtime.onMessage.addListener(() => {
    pageLoaded ? subscribers.forEach(fn => fn()) : (pageLoaded = true)
  })

  return cb => subscribers.push(cb)
})()

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const arrGetRandom = (arr, amount) => {
  const min = 0
  const max = arr.length - 1

  if (amount > arr.length) {
    throw new Error('Amount is bigger than array length.')
  }

  const result = {}

  while (Object.keys(result).length < amount) {
    const index = randomBetween(min, max)
    if (!result[index]) result[index] = arr[index]
  }
  return Object.values(result).sort(() => 0.5 - Math.random())
}

const appendHTML = (el, htmlStr) => {
  const container = document.createElement('div')
  container.innerHTML = htmlStr
  el.appendChild(container.firstElementChild)
}

const observe = (el, cb, options = { childList: true }) => {
  const func = mutations => cb(mutations) === false && mo.disconnect()
  const mo = new MutationObserver(func)
  mo.observe(el, options)
}

const $ = s => Array.from(document.querySelectorAll(s))

module.exports = {
  renderStyles,
  headReady,
  currentPathname,
  onUrlChange,
  arrGetRandom,
  appendHTML,
  $,
  observe
}
