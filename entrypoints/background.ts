export default defineBackground({
  type: 'module',
  main() {
    browser.webRequest.onBeforeRequest.addListener(
      (details) => {
        const pot = new URL(details.url).searchParams.get('pot')

        storage.setItem('local:pot', pot)

        return { cancel: false }
      },
      { urls: ['https://www.youtube.com/api/timedtext*'] },
      ['requestBody'],
    )
  },
})
