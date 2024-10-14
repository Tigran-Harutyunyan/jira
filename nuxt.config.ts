// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',

  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL,
      appwrite: {
        APPWRITE_ENDPOINT: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
        APPWRITE_PROJECT_ID: process.env.NUXT_PUBLIC_APPWRITE_PROJECT
      }
    }
  },
})