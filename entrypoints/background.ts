function enableSidePanel() {
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error: unknown) => console.error(error))
}

export default defineBackground(() => {
  enableSidePanel()

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const id = sender.tab?.id
    const url = sender.tab?.url

    if (id && url && message.action === actionKeys.injectBridgeFrame) {
      Promise.all([
        browser.scripting.executeScript({
          target: { tabId: id },
          files: ['/bridge-iframe.js'],
          world: 'ISOLATED',
        }),
      ]).then(() => {
        sendResponse({ success: true, tabId: id, origin: new URL(url).origin })
      })
    } else {
      Promise.resolve().then(() => {
        sendResponse({ success: false })
      })
    }

    return true
  })
})
