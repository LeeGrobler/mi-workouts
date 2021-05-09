const { func } = require('@/plugins/firebase');

const defaultState = () => ({
  online: navigator.onLine,
  recaptchaScore: null,
});

const state = defaultState();

const getters = {
  getOnline: state => state.online,
  getRecaptchaScore: state => state.recaptchaScore,
};

const mutations = {
  setOnline: (state, payload) => state.online = payload,
  setRecaptchaScore: (state, payload) => state.recaptchaScore = payload,
};

const actions = {
  contact({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await func.contact(payload);
        return resolve(res);
      } catch (err) {
        return reject(err);
      }
    });
  },

  validateRecaptcha({ getters, commit }, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const getScore = getters.getRecaptchaScore;
        
        if(!getScore) {
          const { data } = await func.botcheck(token);
          if(data.success) {
            console.log('setting score:', data.score);
            commit('setRecaptchaScore', data.score);
          }
        }
        
        return resolve(getScore);
      } catch (err) {
        return reject(err);
      }
    });
  },

  monitorConnection({ commit }) {
    window.addEventListener('online', () => commit('setOnline', true));
    window.addEventListener('offline', () => commit('setOnline', false));
  },

  generatePayment({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await func.generatePayment(payload);
        if(data.status === 'success') return resolve(data);
        return reject(data);
      } catch (err) {
        return reject(err);
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
