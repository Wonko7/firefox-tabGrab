/* global window */
/* global browser */

const searchWithHistory = (() => {
  let hist = ''
  return () => hist = window.prompt('Grab tabs matching:', hist) // eslint-disable-line no-return-assign, no-alert
})()

browser.runtime.onMessage.addListener((message, sender, sendResp) => {
  if (message.command === 'get-search') {
    const search = searchWithHistory()
    sendResp(search)
  }
})
