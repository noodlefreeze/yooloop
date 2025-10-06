import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['webRequest', 'storage'],
    host_permissions: ['https://www.youtube.com/watch?v=*'],
    web_accessible_resources: [
      {
        matches: ["https://www.youtube.com/*"],     
        resources: ['injected.js'],
      }
    ],
    browser_specific_settings: {
      "gecko": {
        "id": "noodlefreeze@gmail.com",
        "strict_min_version": "109.0"
      }
    }
  },
  manifestVersion: 3,
  imports: false,
  webExt: {
    // has audio tracks; no audio tracks
    startUrls: ['https://www.youtube.com/watch?v=mw2z9lV3W1g', 'https://www.youtube.com/watch?v=OPG47_wT3XI'],
  },
})
