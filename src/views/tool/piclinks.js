import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import VueMarkdown from 'vue-markdown';

// Vue.component('vue-markdown', VueMarkdown);
Vue.config.productionTip = false;
// import VueMathjax from 'vue-mathjax'
// Vue.use(VueMathjax)

Vue.use(ElementUI);
import PicLinks from '../../components/tools/PicLinks.vue';

new Vue({
  el: '#app',
  render: h => h(PicLinks)
});