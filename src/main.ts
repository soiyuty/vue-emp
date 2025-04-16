

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import Element from 'element-plus'
import 'element-plus/dist/index.css'
app.use(router).use(Element).mount('#app')


