const { db, Routines, analytics } = require('@/plugins/firebase');

const defaultState = () => {
  return {
    snaps: {},
    routines: null,
  };
};

const state = defaultState();

const getters = {
  getSnaps: state => state.snaps,
  getRoutines: state => state.routines,
};

const mutations = {
  setSnaps: (state, payload) => state.snaps = payload,
  addSnaps: (state, payload) => state.snaps = {
    ...state.snaps,
    ...payload
  },
  setRoutines: (state, payload) => state.routines = payload,
};

const actions = {
  fetchUserRoutines({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        Routines.where('user', '==', payload).get().then(res => {
          console.log('routines got');
          const routines = res.docs.map(v => ({ id: v.id, ...v.data() }));
          return resolve(routines);
        });
      } catch(err) {
        console.log('fetchUserRoutines err:', err);
        return reject(err);
      }
    });
  },

  fetchRoutines({ getters, commit, dispatch, rootGetters }) {
    return new Promise(async (resolve, reject) => {
      try {
        if(!!rootGetters['user/getUser']) {
          analytics.logEvent('fetch_routines'); // TODO: you'll have to add analytics for any future data crudding
          if(getters.getSnaps.routine) dispatch('unsubscribeFromSnapshot', 'routine');

          const routineSnapshot = Routines.where('user', '==', rootGetters['user/getUser'].uid).onSnapshot(snaps => {
            console.log('getting routines');
            const routines = snaps.docs.map(v => ({
              id: v.id,
              ...v.data(),
              loading: false,
              expanded: false,
            }));
            commit('setRoutines', routines.sort((a, b) => a.order > b.order ? 1 : -1));
          }, err => {
            console.log('fetchRoutines.onSnapshot err:', err);
          });

          commit('addSnaps', { routine: routineSnapshot });
          return resolve();
        }

        commit('setRoutines', []);
        return resolve();
      } catch(err) {
        console.log('fetchRoutines err:', err);
        return reject(err);
      }
    });
  },

  upsertRoutine({ getters, rootGetters }, payload) {
    return new Promise((resolve, reject) => {
      try {
        const routine = getters.getRoutines.find(v => v.name === payload.name);
        if((routine && !payload.id) || (routine && payload.id && payload.id !== routine.id)) {
          return reject({ message: `${payload.name} already exists` });
        }

        if(!!payload.id) {
          analytics.logEvent('update_routine');
          Routines.doc(payload.id).update(_.pick(payload, ['name', 'exercises', 'notes', 'user', 'favorite', 'order']));
        } else {
          analytics.logEvent('create_routine');

          let order = 0;
          if(getters.getRoutines?.length > 0) {
            order = _.cloneDeep(getters.getRoutines).sort((a, b) => a.order < b.order ? 1 : -1)[0].order + 1;
          }

          Routines.add({
            ...payload,
            user: payload.user || rootGetters['user/getUser']?.uid,
            favorite: getters.getRoutines.length < 1,
            order
          });
        }

        return resolve();
      } catch (err) {
        console.log('upsertRoutine err:', err);
        return reject(err);
      }
    });
  },

  batchReorder({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const batch = db.batch();
        payload.forEach(v => batch.update(Routines.doc(v.id), { order: v.order }));
        await batch.commit();
        
        return resolve();
      } catch (err) {
        console.log('batchReorder err:', err);
        return reject(err);
      }
    });
  },

  deleteRoutine({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        analytics.logEvent('delete_routine');
        Routines.doc(payload).delete();
        return resolve();
      } catch (err) {
        console.log('deleteRoutine err:', err);
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
