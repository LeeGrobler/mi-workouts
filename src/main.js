import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { VueReCaptcha } from 'vue-recaptcha-v3';
import VueMeta from 'vue-meta';
import VueTour from 'vue-tour';
import global from '@/mixins/global';
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

require('@/assets/scss/vue-tour.css');

Vue.config.productionTip = false;

Bugsnag.start({
  apiKey: process.env.VUE_APP_BUGSNAG_KEY,
  plugins: [new BugsnagPluginVue()]
});

const bugsnagVue = Bugsnag.getPlugin('vue');
bugsnagVue.installVueErrorHandler(Vue);

Vue.use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY });
Vue.use(VueMeta, { refreshOnceOnNavigation: true });
Vue.use(VueTour);

window._ = require('lodash');

new Vue({
  router,
  store,
  vuetify,
  mixins: [global],
  render: h => h(App)
}).$mount('#app');
