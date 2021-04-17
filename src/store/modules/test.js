const { Tests, analytics } = require('@/plugins/firebase');

const defaultState = () => {
  return {
    tests: null,
    snaps: {},
  };
};

const state = defaultState();

const getters = {
  getTests: state => state.tests,
  getSnaps: state => state.snaps,
};

const mutations = {
  setTests: (state, payload) => state.tests = payload,
  setSnaps: (state, payload) => state.snaps = payload,
  addSnaps: (state, payload) => state.snaps = {
    ...state.snaps,
    ...payload
  },
};

const actions = {
  fetchUserTests({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        Tests.where('user', '==', payload).get().then(res => {
          console.log('tests got');
          const tests = res.docs.map(v => ({ id: v.id, ...v.data() }));
          return resolve(tests);
        });
      } catch(err) {
        console.log('fetchUserTests err:', err);
        return reject(err);
      }
    });
  },

  fetchTests({ getters, commit, dispatch, rootGetters }) {
    return new Promise(async (resolve, reject) => {
      try {
        if(!!rootGetters['user/getUser']) {
          analytics.logEvent('fetch_tests'); // TODO: you'll have to add analytics for any future data crudding
          if(getters.getSnaps.test) dispatch('unsubscribeFromSnapshot', 'test');

          const testSnapshot = Tests.where('user', '==', rootGetters['user/getUser'].uid).onSnapshot(snaps => {
            console.log('getting tests');
            const tests = snaps.docs.map(v => ({ id: v.id, ...v.data() }));
            commit('setTests', tests);
          }, err => {
            console.log('fetchTests.onSnapshot err:', err);
          });

          commit('addSnaps', { test: testSnapshot });
          return resolve();
        }

        commit('setTests', []);
        return resolve();
      } catch(err) {
        console.log('fetchTests err:', err);
        return reject(err);
      }
    });
  },

  createTest({ rootGetters }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        analytics.logEvent('create_test');
        Tests.add({ ...payload, user: payload.user || rootGetters['user/getUser']?.uid });
        return resolve();
      } catch (err) {
        console.log('createTest err:', err);
        return reject(err);
      }
    });
  },

  deleteTest({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        analytics.logEvent('delete_test');
        Tests.doc(payload).delete();
        return resolve();
      } catch (err) {
        console.log('deleteTest err:', err);
        return reject(err);
      }
    });
  },

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
