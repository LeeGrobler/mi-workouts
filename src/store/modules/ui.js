import Vue from 'vue';
import credits from '@/config/imageCredits';

const defaultState = () => ({
  credits,
  alert: {},
  dialogue: {},
  footerPos: null,
  mini: true,
  drawer: false,
  metaInfo: {
    title: 'MiWorkouts',
    htmlAttrs: { lang: 'en', amp: true }
  },
});

const state = defaultState();

const getters = {
  getCredits: state => state.credits,
  getAlert: state => state.alert,
  getDialogue: state => state.dialogue,
  getFooterPos: state => state.footerPos,
  getMini: state => state.mini,
  getDrawer: state => state.drawer,
  getMataInfo: state => state.metaInfo,
};

const mutations = {
  setAlert: (state, payload) => state.alert = payload,
  showAlert: (state, payload) => state.alert = { visible: true, ...payload },
  hideAlert: state => state.alert = {},
  showDialogue: (state, payload) => state.dialogue = { visible: true, ...payload },
  hideDialogue: state => state.dialogue = {},
  setFooterPos: (state, payload) => state.footerPos = payload,
  setMini: (state, payload) => state.mini = payload,
  setDrawer: (state, payload) => state.drawer = payload,
};

const actions = {
  hideRecaptcha: async () => Vue.prototype.$recaptchaInstance.hideBadge(),
  showRecaptcha: async () => Vue.prototype.$recaptchaInstance.showBadge(),
  setFooterPos: ({ commit }, payload) => commit('setFooterPos', payload),
  setMini: ({ commit }, payload) => commit('setMini', payload),
  setDrawer: ({ commit }, payload) => commit('setDrawer', payload),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
