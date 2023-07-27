import './assets/main.css'

import { createApp, watchEffect, watch } from 'vue'
import { createPinia } from 'pinia'
import { useStore } from './stores/store'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const store = useStore()
watch(router.currentRoute, async () => {
  const queryParams = router.currentRoute.value.query
  if (!queryParams.jsonPath || !queryParams.audioPath) {
    if (!queryParams.audioPath) {
      queryParams.audioPath = 'Thu-8-21-2008.ogg'
    }
    if (!queryParams.jsonPath) {
      queryParams.jsonPath = queryParams.audioPath + '.json'
    }
    console.log('redirecting to', queryParams)
    await router.push({ query: queryParams, params: queryParams as any })
  }
})
watchEffect(() => (store.jsonPath = router.currentRoute.value.query.jsonPath as string))
watchEffect(() => (store.audioPath = router.currentRoute.value.query.audioPath as string))

app.mount('#app')
