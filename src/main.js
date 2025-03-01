/*
该文件是整个项目的入口文件
*/

// 引入vue
import Vue from 'vue';
// 引入App组件，它是所有组件的父组件
import App from './App.vue';
// 关闭vue生产提示
Vue.config.productionTip = false;

// 创建vue实例对象：vm
new Vue({
  el: '#app',
  // 将App组件放入容器中
  render: (h) => h(App),
  // 安装全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
});
