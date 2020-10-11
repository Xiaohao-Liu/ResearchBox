import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import VueMarkdown from 'vue-markdown';

// Vue.component('vue-markdown', VueMarkdown);
Vue.config.productionTip = false;
import VueMathjax from 'vue-mathjax'
Vue.use(VueMathjax)

Vue.use(ElementUI);
import Main from '../../components/Main.vue';

new Vue({
  el: '#app',
  render: h => h(Main)
});