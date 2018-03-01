const listTabs = () =>  browser.tabs.query({ currentWindow: true })
  .then(tabs => tabs.filter(t => !t.pinned))


const getCurrent = () =>  browser.tabs.query({ currentWindow: true, active: true })
  .then(tabs => browser.tabs.get(tabs[0].id))

function grab(search, count) {
  let   tabs    = listTabs()
  const re      = new RegExp(search.replace(/\\/, '\\\\'))
  const pred    = tab => (tab.title.match(re) || tab.url.match(re))
  const currTab = getCurrent()

  console.log(`${re} vs ${search}`)

  if (count > 0) {
    tabs = tabs.slice(0, count)
  }

  Promise.all([currTab, tabs]).then(([currTab, tabs]) =>  {
    const toMove  = tabs.filter(pred).map(t => t.id)
    console.log(currTab)
    console.log(toMove)
    browser.tabs.move(toMove, { index: currTab.index })
  })
}

//   browser.runtime.onMessage.addListener((message) => {
//     if (message.command === "beastify") {
//       insertBeast(message.beastURL);
//     } else if (message.command === "reset") {
//       removeExistingBeasts();
//     }

console.log('heyyyyyy lmao 2')

grab('slashdot', 0)
  .then(x => console.log('yes, got x:', x))
  .resolve()
