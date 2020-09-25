import Vue from 'vue';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import App from './App.vue';


Vue.use(ElementUI);
Vue.use(VueRouter);

new Vue({
  el: '#app',
  render: h => h(App)
});