import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['webRequest', 'storage'],
    host_permissions: ['https://www.youtube.com/watch?v=*'],
  },
  manifestVersion: 3,
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
