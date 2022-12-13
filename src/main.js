import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
// 导入element plus的CSS
import 'element-plus/dist/index.css'
// reset style sheet
import "./assets//styles/reset.css"
// 导入element plus的图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 多语言
import I18n from "./language"

/**
 * @note   2022.11.28
 * @author cloud-iris
 * vite默认不会处理开发者在H5中导入的svg矢量图标，也就是说
 * 虽然我们把 svg 图标放入了项目中，但是 vite “无法使用” 它们
 * 需要按照 vite 的插件plugin,  vite-plugin-svg-icons
 * npm i vite-plugin-svg-icons -D
 * 并在 main.js vite.config.js 里面分别注册
 * 
 * 这是虚拟模块的引入方式，用于给脚手架插件在打包和开发时做相应的处理。
 * Vite 和 Rollup 中都约定以 virtual: 作为虚拟模块的前缀：
 */
// 注册svg-icons
import 'virtual:svg-icons-register'

const app = createApp(App)
// 导入element plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(createPinia()).use(router).use(I18n).use(ElementPlus).mount('#app')
