import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['webRequest', 'storage'],
    host_permissions: ['https://www.youtube.com/watch?v=*'],
    web_accessible_resources: [
      {
        matches: ["*://*/*"],     
        resources: ['injected.js'],
      }
    ]
  },
  manifestVersion: 3,
})
