async function main() {
  const bc = new BroadcastChannel(extensionBcName)
  console.log('from iframe')

  window.addEventListener('message', (event) => {
    switch (event.data.action) {
      case actionKeys.addShadowing: {
        const blob = new Blob([event.data.payload.audio], { type: event.data.payload.audioType })
        shadowingDB.addShadowing(event.data.payload.vid, blob, event.data.payload.startMs).then(() => {
          parent.postMessage({ action: actionKeys.openSidePanel }, event.origin)
        })
        break
      }
      case actionKeys.broadcast: {
        bc.postMessage(event.data.payload)
        break
      }
      default: {
      }
    }
  })
}

main()
