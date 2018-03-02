/* global browser */

// Helper functions:
const listTabs = () =>  browser.tabs.query({ currentWindow: true })
  .then(tabs => tabs.filter(t => !t.pinned))

const getCurrent = () =>  browser.tabs.query({ currentWindow: true, active: true })
  .then(tabs => browser.tabs.get(tabs[0].id))

// grab all tabs matching search string and group them after current tab:
const grab = async (search, countOrDirectionUnused) => {
  const re                 = new RegExp(search.replace(/\\/, '\\\\'), 'i') // need to test this, maybe seperate by \s? "slash dot" => title.match(slash).match(dot)?
  const rePredicate        = tab => (tab.title.match(re) || tab.url.match(re))
  const [allTabs, currTab] = await Promise.all([listTabs(), getCurrent()])
  const tabsToMove         = allTabs.filter(rePredicate)
  const nbTabsBeforeCurr   = tabsToMove.filter(t => t.index < currTab.index).length

  await browser.tabs.move(tabsToMove.map(t => t.id), { index: currTab.index })
  await browser.tabs.move(currTab.id, { index: currTab.index - nbTabsBeforeCurr })
}

browser.commands.onCommand.addListener((command) => {
  const currTab   = getCurrent()
  const direction = command === 'grab-down' ? 1 : -1 // for now just grabs all.

  return currTab
    .then(t    => browser.tabs.sendMessage(t.id, { command: 'get-search' }))
    .then(resp => grab(resp, direction))
})
