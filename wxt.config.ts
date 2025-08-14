import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['webRequest', 'storage'],
    host_permissions: ['https://www.youtube.com/watch?v=*'],
    web_accessible_resources: [
      {
        resources: ['refresh-pot.js', 'bridge-iframe.js', 'iframe.html'],
        matches: ["https://www.youtube.com/*"],     
      },
    ],
    browser_specific_settings: {
      "gecko": {
        "id": "noodlefreeze@gmail.com",
        "strict_min_version": "109.0"
      }
    }
  },
  manifestVersion: 3,
})
