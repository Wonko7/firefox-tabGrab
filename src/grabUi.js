browser.runtime.onMessage.addListener((message, sender, sendResp) => {
  if (message.command === 'get-search') {
    const search = window.prompt('Grab tabs matching:')
    sendResp(search)
  }
})
