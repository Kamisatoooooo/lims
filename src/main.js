import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'

const app = createApp(App)
installElementPlus(app)
app.use(store)
app.use(router)
app.mount('#app')
