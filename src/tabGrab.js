function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    const tabsList    = document.getElementById('tabs-list')
    const currentTabs = document.createDocumentFragment()
      .filter(t => t.pinned)
      // .sort((t1, t2) => t1.index <= t2.index)

    currentTabs.map(t => console.log('tab: ', t.index))
  })
}


function callOnActiveTab(tab, tabs) {
  let index = 0;
  console.log(`moving ${tab.id} to ${index}`)
  browser.tabs.move([tab.id], {index});
}


listTabs()
