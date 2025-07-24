import type { ContentScriptContext } from '#imports';
import { waitForElement } from '@/utils/dom';
import { createRoot } from 'react-dom/client';
import '~/assets/tailwind.css';
import App from './app';

const mountElSelector = '#secondary.style-scope.ytd-watch-flexy'

export default defineContentScript({
  matches: ['https://www.youtube.com/watch?v=*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    try {

      await waitForElement(mountElSelector)

      const ui = await createUi(ctx)

      ui.mount()
    } catch (error) {
      console.error((error as Error).message)
    }
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: 'yooloop-ui',
    position: 'inline',
    anchor: mountElSelector,
    append: 'first',
    onMount: (uiContainer) => {
      const wrapper = document.createElement('div')

      uiContainer.append(wrapper)

      const root = createRoot(wrapper)

      root.render(<App ctx={ctx} />)

      return { root, wrapper }
    },
    onRemove: (elements) => {
      elements?.root.unmount()
      elements?.wrapper.remove()
    }
  })
}
