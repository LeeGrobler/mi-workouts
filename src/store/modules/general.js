import Vue from 'vue';

const { Affiliates, func, analytics } = require('@/plugins/firebase');

const defaultState = () => ({
  snaps: {},
  online: navigator.onLine,
  recaptchaScore: null,
  // promos: null,
});

const state = defaultState();

const getters = {
  getOnline: state => state.online,
  getRecaptchaScore: state => state.recaptchaScore,
  // getPromos: state => state.promos,
  getSnaps: state => state.snaps,
};

const mutations = {
  setOnline: (state, payload) => state.online = payload,
  setRecaptchaScore: (state, payload) => state.recaptchaScore = payload,
  // setPromos: (state, payload) => state.promos = payload,
  setSnaps: (state, payload) => state.snaps = payload,
  addSnaps: (state, payload) => state.snaps = { ...state.snaps, ...payload },
};

const actions = {
  monitorConnection({ commit }) {
    window.addEventListener('online', () => commit('setOnline', true));
    window.addEventListener('offline', () => commit('setOnline', false));
  },

  contact({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await func.contact(payload);
        return resolve(res);
      } catch (err) {
        console.log('contact:', err);
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
        console.log('validateRecaptcha:', err);
        return reject(err);
      }
    });
  },

  submitPayfastDonation({ dispatch, rootGetters }, { amount }) {
    return new Promise(async (resolve, reject) => {
      try {
        const paymentData = {
          merchant_id: process.env.VUE_APP_PAYFAST_MERCHANT_ID,
          merchant_key: process.env.VUE_APP_PAYFAST_MERCHANT_KEY,
          return_url: `${process.env.VUE_APP_BASE_URL}/payment-complete`,
          cancel_url: `${process.env.VUE_APP_BASE_URL}`,
          notify_url: process.env.VUE_APP_PAYFAST_PROCESS_PAYMENT_URL,
    
          name_first: rootGetters['user/getUser']?.displayName?.split(' ')[0] || null,
          name_last: rootGetters['user/getUser']?.displayName?.split(' ')[1] || null,
          email_address: rootGetters['user/getUser']?.email || null,
    
          m_payment_id: null,
          amount: amount.toString(),
          item_name: 'MiWorkouts Donation',
        }
    
        const token = await Vue.prototype.$recaptcha('generate_payment');
        const { data: payment } = await func.generatePayment({ ...paymentData, token });
        if(payment.status === 'failed') return reject(payment);
    
        paymentData.m_payment_id = payment.response?.m_payment_id;
        paymentData.signature = payment.response?.hash;
        paymentData.return_url += `?id=${payment.response?.m_payment_id}`;
    
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${process.env.VUE_APP_PAYFAST_URL}/eng/process`;
    
        Object.keys(paymentData).forEach(v => {
          const input = document.createElement('input');
          input.name = v;
          input.value = paymentData[v];
          input.type = 'hidden';
    
          form.appendChild(input);
        });
    
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        analytics.logEvent('donate', { amount });
        return resolve();
      } catch (err) {
        console.log('submitPayfastDonation:', err);
        return reject(err);
      }
    });
  },

  // fetchPromos({ commit }) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       if(getters.getSnaps.promo) dispatch('unsubscribeFromSnapshot', 'promo');

  //       const promoSnapshot = await Affiliates.onSnapshot(
  //         snaps => commit('setPromos', snaps.docs.map(v => ({ id: v.id, ...v.data(), }))),
  //         err => console.log('fetchPromos.onSnapshot err:', err)
  //       );

  //       commit('addSnaps', { promo: promoSnapshot });
  //       return resolve();
  //     } catch (err) {
  //       console.log('fetchPromos err:', err);
  //       return reject(err);
  //     }
  //   });
  // },

  unsubscribeFromSnapshots({ getters, commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const snaps = getters.getSnaps;
        Object.keys(snaps).forEach(v => snaps[v]());

        commit('setSnaps', {});
        return resolve();
      } catch (err) {
        console.log('unsubscribeFromSnapshots err:', err);
        return reject(err);
      }
    });
  },

  unsubscribeFromSnapshot({ getters, commit }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        if(getters.getSnaps[payload]) {
          getters.getSnaps[payload]();
          const snaps = {};
          Object.keys(getters.getSnaps).forEach(v => {
            if(v !== payload) snaps[v] = getters.getSnaps[v];
          });
          commit('addSnaps', snaps);
        }
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
