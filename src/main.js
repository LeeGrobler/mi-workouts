import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { VueReCaptcha } from 'vue-recaptcha-v3';
import VueMeta from 'vue-meta';
import global from '@/mixins/global';

Vue.config.productionTip = false;

Vue.use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY });
Vue.use(VueMeta, { refreshOnceOnNavigation: true });

window._ = require('lodash');

new Vue({
  router,
  store,
  vuetify,
  mixins: [global],
  render: h => h(App)
}).$mount('#app');
