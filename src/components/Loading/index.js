import { h, render } from 'vue';
import customLoadingVue from './SandboxLoading.vue';

export const showLoading = () => {
  // 1.返回 vnode
  const vnode = h(customLoadingVue);
  // 2. render函数渲染 vnode
  console.log("开始加载");
  render(vnode, document.body);
}

export const hideLoading = () => {
  // 3. loading 组件销毁
  console.log("加载结束");
  render(null, document.body);
}