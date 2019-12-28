chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})

const getHost = url => {
  const a = document.createElement('a')
  a.href = url
  return a.host
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const host = getHost(changeInfo.url).replace(/^www\./, '')
  if (changeInfo.status === 'loading' && host && ['twitter.com', 'reddit.com'].includes(host)) {
    chrome.tabs.sendMessage(tabId, {})
  }
})


chrome.storage.onChanged.addListener((changes, namespace) => {
  
})