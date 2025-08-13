function enableSidePanel() {
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error: unknown) => console.error(error))
}

const handlers: Record<string, (message: IDBMessage) => Promise<unknown>> = {
  [actionKeys.addShadowing]: (message) => addShadowing(message.payload as Pick<Shadowing, UserShadowing>),
  [actionKeys.getAllShadowing]: getAllShadowing,
  [actionKeys.connectIDB]: async () => {
    try {
      await openDb()

      return {
        success: true,
        message: 'IDB connected successfully',
      }
    } catch (error) {
      console.error('Failed to connect IDB:', error)
      return {
        success: false,
        message: error,
      }
    }
  },
}

export default defineBackground(() => {
  enableSidePanel()

  browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    const action = message.action
    let promise: Promise<unknown>

    if (!action || !(action in handlers)) {
      promise = Promise.reject({
        success: false,
        error: new Error(`Unknown action: ${action}`),
      })
    } else {
      promise = handlers[action](message)
    }

    promise
      .then((result) => {
        sendResponse({ success: true, data: result })
      })
      .catch((error) => {
        console.error(error)
        sendResponse({ success: false, error })
      })

    // keep the message channel open
    return true
  })
})
