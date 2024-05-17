// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["nuxt-primevue", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  primevue: {
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
    components: {
      include: ["Button", "Dialog", "Toast"],
      exclude: ["Editor", "Chart"],
    },
    options: {
      ripple: true,
      locale: {
        emptyMessage: "Nu sunt articole in listă",
        emptySearchMessage: "Nu am găsit rezultate pentru această căutare",
      },
    },
  },
  css: [
    "primevue/resources/themes/aura-light-green/theme.css",
    "primeicons/primeicons.css",
  ],
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectionPosition: "first" }],
  },
  runtimeConfig: {
    public: {
      API_ENDPOINT:
        process.env.NODE_ENV === "production"
          ? process.env.API_ENDPOINT
          : "http://localhost/work/request-collect-and-forward/backend/requests.php",
    },
  },
});
