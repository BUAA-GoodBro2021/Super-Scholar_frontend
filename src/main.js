import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
// reset style sheet
import "./assets/reset.css"
// 导入element plus的CSS
import 'element-plus/dist/index.css'
import I18n from "./language"
const app = createApp(App)

app.use(createPinia()).use(router).use(I18n).use(ElementPlus).mount('#app')
