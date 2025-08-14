async function main() {
  window.addEventListener('message', (event) => {
    if (event.origin === 'https://www.youtube.com') {
      addShadowing(event.data.payload)
    }
  })
}

main()
