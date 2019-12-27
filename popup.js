const $ = q => Array.from(document.querySelectorAll(q))

chrome.storage.sync.get(['reddit', 'twitter'], ({ reddit, twitter }) => {
  $('input').forEach(($input, i) => {
    $input.checked = [reddit, twitter][i]
  })
})


$('input').forEach($input => {
  $input.addEventListener('change', () => {
    chrome.storage.sync.set({ [$input.name]: $input.checked })
  })
})