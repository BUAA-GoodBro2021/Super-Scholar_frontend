import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
// reset style sheet
import "./assets/reset.css"
// 导入element plus的CSS
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 导入element plus的图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import I18n from "./language"
const app = createApp(App)
// 导入element plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(createPinia()).use(router).use(I18n).use(ElementPlus).mount('#app')
