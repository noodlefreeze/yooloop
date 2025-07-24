import type { ContentScriptContext } from '#imports';
import { waitForElement } from '@/utils/dom';
import '~/assets/tailwind.css';

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
      const p = document.createElement("p");
      p.classList.add("text-lg", "text-red-500", "font-bold", "p-8");
      p.textContent = "Hello from shadow root with TailwindCSS applied";
      uiContainer.append(p);
    }
  })
}