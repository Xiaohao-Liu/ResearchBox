import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
import FirstSetting from '../../components/FirstSetting.vue';

new Vue({
  el: '#app',
  render: h => h(FirstSetting)
});