/* global browser */

// Helper functions:
const listTabs = () => browser.tabs.query({ currentWindow: true })
  //.then(tabs => tabs.filter(t => !t.pinned))

const getCurrentTab = () => browser.tabs.query({ currentWindow: true, active: true })
  .then(tabs => browser.tabs.get(tabs[0].id))

const filterTabs = async (search) => {
  const re               = new RegExp(search.replace(/\\/, '\\\\'), 'i') // need to test this, maybe seperate by \s? "slash dot" => title.match(slash).match(dot)?
  const rePredicate      = tab => (tab.title.match(re) || tab.url.match(re))
  const allTabs          = await listTabs()
  const filtered         = allTabs.filter(rePredicate)

  return filtered
}

// grab all tabs matching search string and group them after current tab:
const grab = async (currTab, tabsToMove) => {
  const nbTabsBeforeCurr = tabsToMove.filter(t => t.index < currTab.index).length

  await browser.tabs.move(tabsToMove.map(t => t.id), { index: currTab.index })
  await browser.tabs.move(currTab.id, { index: currTab.index - nbTabsBeforeCurr })
}

const sendToEmacs = async (tabsP) => {
  const tabs = await tabsP
  all = tabs.reduce((acc, t) => acc + "&title=" + encodeURIComponent(t.title) + "&url=" + encodeURIComponent(t.url),
                    "org-protocol://yolobolo?session=haha")
  location.href = all
}

browser.commands.onCommand.addListener(async (command) => {
  const currTab   = await getCurrentTab()
  if (command == "grab") {

    const response  = await browser.tabs.sendMessage(currTab.id, { command: 'get-search' })
    const tabs      = filterTabs(response)

    await grab(currTab, tabs)
  } else {
    const tabs      = listTabs()
    await sendToEmacs(tabs)
  }
})
