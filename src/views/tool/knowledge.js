import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
// import VueMathjax from 'vue-mathjax'
// Vue.use(VueMathjax)

Vue.use(ElementUI);
import KnowledgeBase from '../../components/tools/KnowledgeBase.vue';

new Vue({
  el: '#app',
  render: h => h(KnowledgeBase)
});