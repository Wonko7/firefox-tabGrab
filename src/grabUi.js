browser.runtime.onMessage.addListener((message, sender, sendResp) => {
  if (message.command === 'get-search') {
    const search = window.prompt('lol')
    sendResp(search)
  }
})
