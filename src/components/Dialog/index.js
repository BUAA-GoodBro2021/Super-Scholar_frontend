import { h, render } from "vue";
import confirmComponent from "./DialogWindow.vue";
/**
 * 函数调用触发对话框组件
 * 如果用户只传递一个参数，那么这个参数为 content
 * @param {*} title 标题(如果没有传递content，那么作为第一个参数的title被作为content)
 * @param {*} content 内容
 * @param {*} cancelText 取消按钮文本
 * @param {*} confirmText 确认按钮文本
 */
export const showConfirmDialog = 
(title, content, cancelText, confirmText) => {
  /**
   * 在使用时，用户通过 
   * showConfirmDialog.then(() => {}).catch(() => {})
   * 分别传入 resolve, reject
   */
  return new Promise((resolve, reject) => {
    // 允许只传入 content 
    if (title && !content) {
      content = title;
      title = '';
    }
    // 取消按钮事件
    const cancelHandler = () => {
      reject(new Error('取消按钮点击'));     
    };
    // 确定按钮事件
    const confirmHandler = () => {
      resolve();
    };
    // 关闭弹层事件
    const closeHandler = () => {
      // 3.所谓关闭，其实就是利用 render 把渲染的 vnode 去掉
      //   render 第一个参数传入 null，就可以把刚才渲染的 vnode 去掉了
      //    https://coding.imooc.com/learn/questiondetail/380V9YvyNq4P4Nxw.html
      // 这里必须清除vnode，否则下一次点击的时候，由于这个对话框还存在只是隐藏了，
      // 我们是在生命周期的 onMounted 阶段将 isVisable 调为 true的（这是为了展示动画，不然render即时渲染会丢失动画），
      // 组件没有被销毁，所以没有办法触发一次生命周期，使得 isVisable 调为 true
      render(null, document.body);
    };
    // 1.h 函数生成 vnode
    const vnode = h(
      confirmComponent,
      {
        title,
        content,
        cancelText, 
        confirmText,
        cancelHandler,
        confirmHandler,
        closeHandler
      }
    );
    // 2. render 函数渲染 vnode
    render(vnode, document.body);
  })
}