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

//const send_to_emacs = async (tab) => location.href = 'org-protocol://tabs  ?template=Ql&ref=' + encodeURIComponent(t.url) + '&title=' + encodeURIComponent(t.title)

// grab all tabs matching search string and group them after current tab:
const grab = async (currTab, tabsToMove) => {
  const nbTabsBeforeCurr = tabsToMove.filter(t => t.index < currTab.index).length

  await browser.tabs.move(tabsToMove.map(t => t.id), { index: currTab.index })
  await browser.tabs.move(currTab.id, { index: currTab.index - nbTabsBeforeCurr })
}

const openInEmacs = async (tabsP) => {
  console.log("tabs:")
  const tabs = await tabsP
  // var lol = "org-protocol://yolobolo?lol=haha"
  console.log(tabs)
  // ll = tabs.reduce((acc, t) => acc +"&title=" + uencodeURIComponent(t.title) + "&url=" + uencodeURIComponent(t.url) " ", "")

  console.log("wtf?")
  all = tabs.reduce((acc, t) => acc +"&title=" + encodeURIComponent(t.title) + "&url=" + encodeURIComponent(t.url),
                    "org-protocol://yolobolo?lol=haha")

  console.log("wtf2", all)
  location.href = all
}

browser.commands.onCommand.addListener(async (command) => {
  const direction = command === 'grab-down' ? 1 : -1 // for now just grabs all.
  const currTab   = await getCurrentTab()
  const response  = await browser.tabs.sendMessage(currTab.id, { command: 'get-search' })
  const tabs      = filterTabs(response)

  //await grab(currTab, tabs)
  await openInEmacs(tabs)
})
