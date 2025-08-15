function enableSidePanel() {
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error: unknown) => console.error(error))
}

export default defineBackground(() => {
  enableSidePanel()

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const id = sender.tab?.id
    const url = sender.tab?.url
    if (!id || !url) return

    switch (message.action) {
      case actionKeys.injectBridgeFrame: {
        Promise.all([
          browser.scripting.executeScript({
            target: { tabId: id },
            files: ['/bridge-iframe.js'],
            world: 'ISOLATED',
          }),
        ]).then(() => {
          sendResponse({ success: true, tabId: id, origin: new URL(url).origin })
        })
        break
      }
      case actionKeys.openSidePanel: {
        browser.sidePanel.open({ tabId: id }).then(() => {
          sendResponse(true)
        })
        break
      }
      default: {
        // do nothing
      }
    }
    return true
  })
})
