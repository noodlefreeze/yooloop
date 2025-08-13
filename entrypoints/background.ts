function enableSidePanel() {
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error: unknown) => console.error(error))
}

const shadowingStoreName = 'shadowing'

function openIDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const version = 1
    const dbName = 'yooloop'
    const request = indexedDB.open(dbName, version)

    request.onerror = function (this) {
      reject(this.error)
    }
    request.onupgradeneeded = function (this) {
      const db = this.result

      if (!db.objectStoreNames.contains(shadowingStoreName)) {
        db.createObjectStore(shadowingStoreName, { keyPath: 'id', autoIncrement: true })
      }
    }
    request.onsuccess = function (this) {
      resolve(this.result)
    }
  })
}

function getReadWriteStore(db: IDBDatabase, storeName: string) {
  return db.transaction(storeName, 'readwrite').objectStore(storeName)
}

function getReadStore(db: IDBDatabase, storeName: string) {
  return db.transaction(storeName, 'readonly').objectStore(storeName)
}

function IDBOperations(db: IDBDatabase) {
  browser.runtime.onMessage.addListener(async (message: IDBMessage, _, sendResponse) => {
    switch (message.action) {
      case actionKeys.addShadowing: {
        const store = getReadWriteStore(db, shadowingStoreName)
        const request = store.add(message.payload)

        request.onsuccess = function (this) {
          sendResponse({
            success: true,
            id: this.result,
          })
        }
        request.onerror = function (this) {
          sendResponse({
            success: false,
            error: this.error,
          })
        }
        break
      }
      case actionKeys.getAllShadowing: {
        const store = getReadStore(db, shadowingStoreName)
        const request = store.getAll()

        request.onsuccess = function (this) {
          sendResponse({
            success: true,
            shadowing: this.result,
          })
        }
        request.onerror = function (this) {
          sendResponse({
            success: false,
            error: this.error,
          })
        }
        break
      }
      default: {
        sendResponse({
          success: false,
          error: new DOMException('unknown action'),
        })
      }
    }

    return true
  })
}

let pinged = false
async function ensureIDB(message: IDBMessage, _: unknown, sendResponse: (response?: unknown) => void) {
  switch (message.action) {
    case actionKeys.pingIDB: {
      pinged = true

      openIDB()
        .then((db) => {
          db.close()
          sendResponse({
            success: true,
          })
        })
        .catch((error) => {
          browser.runtime.sendMessage({
            source: messageKeys.backgroundSource,
            action: actionKeys.openIDBFailed,
            payload: error,
          })
        })
      break
    }
    case actionKeys.connectIDB: {
      if (!pinged) {
        sendResponse({
          success: false,
          error: new DOMException('ping before connect'),
        })
        return
      }

      // Already pinged, so theoretically there’s no need to handle errors
      openIDB().then((db) => {
        IDBOperations(db)
        browser.runtime.onMessage.removeListener(ensureIDB)
        sendResponse({ success: true })
      })
      break
    }
    default: {
      sendResponse({
        success: false,
        error: new DOMException('unknown action'),
      })
    }
  }

  return true
}

export default defineBackground(() => {
  enableSidePanel()

  browser.runtime.onMessage.addListener(ensureIDB)
})
