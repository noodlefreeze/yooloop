import type { ContentScriptContext } from '#imports'
import { createRoot } from 'react-dom/client'
import '~/assets/tailwind.css'

export default defineContentScript({
  matches: ['https://www.youtube.com/watch?v=*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    try {
      await Promise.all([waitForElement(mountElSelector)])

      const ui = await createUi(ctx)

      ui.mount()
    } catch (error) {
      console.error((error as Error).message)
    }
  },
})

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: 'yooloop-ui',
    position: 'inline',
    anchor: mountElSelector,
    append: 'first',
    onMount: async (uiContainer) => {
      const wrapper = document.createElement('div')

      uiContainer.append(wrapper)

      const root = createRoot(wrapper)
      const App = (await import('./app')).default

      root.render(<App ctx={ctx} />)

      return { root, wrapper }
    },
    onRemove: async (elementsPromise) => {
      const elements = await elementsPromise

      elements?.root.unmount()
      elements?.wrapper.remove()
    },
  })
}
