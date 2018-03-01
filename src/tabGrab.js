// Helper functions:
const listTabs = () =>  browser.tabs.query({ currentWindow: true })
  .then(tabs => tabs.filter(t => !t.pinned))

const getCurrent = () =>  browser.tabs.query({ currentWindow: true, active: true })
  .then(tabs => browser.tabs.get(tabs[0].id))

// grab all tabs matching search string and group them after current tab:
function grab(search, countOrDirectionUnused) {
  let   tabs    = listTabs()
  const re      = new RegExp(search.replace(/\\/, '\\\\'))
  const pred    = tab => (tab.title.match(re) || tab.url.match(re))
  const currTab = getCurrent()

  Promise.all([currTab, tabs]).then(([currTab, tabs]) => {
    const toMove  = tabs.filter(pred).map(t => t.id)
    browser.tabs.move(toMove, { index: currTab.index })
  })
}

browser.commands.onCommand.addListener((command) => {
  const currTab   = getCurrent()
  const direction = command === 'grab-down' ? 1 : -1 // for now just grabs all.

  currTab
    .then(t    => browser.tabs.sendMessage(t.id, { command: 'get-search' }))
    .then(resp => grab(resp, 0))
})
