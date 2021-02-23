import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import VueMarkdown from 'vue-markdown';

// Vue.component('vue-markdown', VueMarkdown);
Vue.config.productionTip = false;

Vue.use(ElementUI);
import Download from '../../components/FM/Download.vue';

new Vue({
  el: '#app',
  render: h => h(Download)
});