async function main() {
  const bc = new BroadcastChannel(extensionBcName)

  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://www.youtube.com' || event.data.action !== actionKeys.addShadowing) return
  })
}

main()
