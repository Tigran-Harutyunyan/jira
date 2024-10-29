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
    '@hebilicious/vue-query-nuxt',
    '@samk-dev/nuxt-vcalendar',
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
      APPWRITE_ENDPOINT: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
      PROJECT_ID: process.env.NUXT_PUBLIC_APPWRITE_PROJECT,
    },
    APPWRITE_ENDPOINT: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
    PROJECT_ID: process.env.NUXT_PUBLIC_APPWRITE_PROJECT,
    WORKSPACES_ID: process.env.NUXT_PUBLIC_APPWRITE_WORKSPACES_ID,
    MEMBERS_ID: process.env.NUXT_PUBLIC_APPWRITE_MEMBERS_ID,
    IMAGES_BUCKET_ID: process.env.NUXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
    PROJECTS_ID: process.env.NUXT_PUBLIC_APPWRITE_PROJECTS_ID,
    DATABASE_ID: process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID,
    TASKS_ID: process.env.NUXT_PUBLIC_APPWRITE_TASKS_ID,
  },
})