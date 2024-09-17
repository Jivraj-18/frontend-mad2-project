import { createApp } from 'vue'
import App from './App.vue'
import {createWebHistory, createRouter} from 'vue-router'
import routes from './routes/index.js'
import store from './vuex.js'
const router = createRouter({
    history : createWebHistory(),
    routes:routes
})

const app = createApp(App)


app.use(router)
app.use(store)
app.mount('#app')



