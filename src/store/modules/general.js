import Vue from 'vue';

const { func, analytics } = require('@/plugins/firebase');

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

  // generatePayment({}, payload) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const { data } = await func.generatePayment(payload);
  //       if(data.status === 'success') return resolve(data);
  //       return reject(data);
  //     } catch (err) {
  //       return reject(err);
  //     }
  //   });
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
