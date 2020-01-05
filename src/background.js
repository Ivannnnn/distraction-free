chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
  //chrome.runtime.reload()
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const host = new URL(tab.url).host.replace(/^www\./, '')
  console.log(changeInfo.status)
  if (
    changeInfo.status === 'loading' &&
    [
      'twitter.com',
      'reddit.com',
      'facebook.com',
      'youtube.com',
      'linkedin.com'
    ].includes(host)
  ) {
    chrome.tabs.sendMessage(tabId, {})
  }
})
