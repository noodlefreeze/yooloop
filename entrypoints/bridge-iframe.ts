export default defineUnlistedScript(() => {
  const wrapper = document.createElement('div')
  wrapper.style.setProperty('width', '0')
  wrapper.style.setProperty('height', '0')

  const iframe = document.createElement('iframe')
  iframe.style.setProperty('width', '0')
  iframe.style.setProperty('height', '0')
  iframe.src = browser.runtime.getURL('/iframe.html')
  iframe.id = bridgeIframeId

  wrapper.appendChild(iframe)
  document.body.appendChild(iframe)
})
