import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import ui from './modules/ui';
import user from './modules/user';
import general from './modules/general';
import test from './modules/test';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  strict: window.ENV !== "production",
  modules: { ui, user, general, test },
});
