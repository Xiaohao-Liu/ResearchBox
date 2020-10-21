import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import VueMarkdown from 'vue-markdown';

// Vue.component('vue-markdown', VueMarkdown);
Vue.config.productionTip = false;

Vue.use(ElementUI);
import FR from '../../components/tools/FR.vue';

new Vue({
  el: '#app',
  render: h => h(FR)
});