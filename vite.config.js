import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 支持自动导入elementPlus
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

/**
 * @note   2022.11.28
 * @author cloud-iris
 * vite默认不会处理开发者在H5中主动导入的svg矢量图标，也就是说
 * 虽然我们把 svg 图标放入了项目中，但是 vite “无法使用” 它们
 * 需要按照 vite 的插件plugin,  vite-plugin-svg-icons
 * pnpm i vite-plugin-svg-icons -D
 * 并在 main.js vite.config.js 里面分别注册
 */
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({

  css: {
    devSourcemap: true,
  },

  // 在plugins中配置插件 
  plugins: [
    vue(),
    // VueAPI的自动导入
    AutoImport({
      // import目标
      include:[
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
      ],
      // 自动导入的包
      imports:['vue','vue-router','@vueuse/core'],
      resolvers: [ElementPlusResolver()],
    }),
    // 组件自动导入
    Components({
      // 文件夹
      dirs: ['src/components'],
      extensions: ['vue'],
      // 支持深度导入
      deep: true,
      include: [/\.vue$/, /\.vue\?vue/],
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]\.git[\\/]/,
        /[\\/]\.nuxt[\\/]/,
      ],
      resolvers: [ElementPlusResolver()],
    }),
    // vite 项目的 template 使用 svg
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定 symbolId 格式，匹配 src/libs/svg-icon/index.vue 中的格式 `#icon-${props.svgName}`
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    // 定义别名
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    // import时可以省略的后缀文件名 from 'ABC.vue'可以写成 from 'ABC'
    extensions: ['.js',',ts','.json','.jsx','.tsx','.vue'],
  },
  build:{
    minify: 'terser',
    sourcemap: true,
    terserOptions:{
      compress:{
        // 生产环境中移除console.log()和debugger
        drop_console:true,
        drop_debugger:true,
      }
    }
  }
})
