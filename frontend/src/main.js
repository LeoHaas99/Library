import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router/'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'

const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
app.use(VueLazyload, {
    preLoad: 1.3,
    error: 'error-image-path', // path to the error image
    loading: 'loading-image-path', // path to the loading image
    attempt: 1
  });
app.mount('#app')