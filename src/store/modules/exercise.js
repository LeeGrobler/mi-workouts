const { Exercises, analytics } = require('@/plugins/firebase');

const defaultState = () => {
  return {
    snaps: {},
    exercises: null,
  };
};

const state = defaultState();

const getters = {
  getSnaps: state => state.snaps,
  getExercises: state => state.exercises,
};

const mutations = {
  setSnaps: (state, payload) => state.snaps = payload,
  addSnaps: (state, payload) => state.snaps = {
    ...state.snaps,
    ...payload
  },
  setExercises: (state, payload) => state.exercises = payload,
};

const actions = {
  fetchUserExercises({}, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        Exercises.where('user', '==', payload).get().then(res => {
          console.log('exercises got');
          const exercises = res.docs.map(v => ({ id: v.id, ...v.data() }));
          return resolve(exercises);
        });
      } catch(err) {
        console.log('fetchUserExercises err:', err);
        return reject(err);
      }
    });
  },

  fetchExercises({ getters, commit, dispatch, rootGetters }) {
    return new Promise(async (resolve, reject) => {
      try {
        if(!!rootGetters['user/getUser']) {
          analytics.logEvent('fetch_exercises'); // TODO: you'll have to add analytics for any future data crudding
          if(getters.getSnaps.exercise) dispatch('unsubscribeFromSnapshot', 'exercise');

          const exerciseSnapshot = Exercises.where('user', '==', rootGetters['user/getUser'].uid).onSnapshot(snaps => {
            console.log('getting exercises');
            const exercises = snaps.docs.map(v => ({
              id: v.id,
              ...v.data(),
              loading: false,
            }));
            commit('setExercises', exercises.sort((a, b) => a.name > b.name ? 1 : -1));
          }, err => {
            console.log('fetchExercises.onSnapshot err:', err);
          });

          commit('addSnaps', { exercise: exerciseSnapshot });
          return resolve();
        }

        commit('setExercises', []);
        return resolve();
      } catch(err) {
        console.log('fetchExercises err:', err);
        return reject(err);
      }
    });
  },

  upsertExercise({ getters, rootGetters }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const exercise = getters.getExercises.find(v => v.name === payload.name);
        if((exercise && !payload.id) || (exercise && payload.id && payload.id !== exercise.id)) {
          return reject({ message: `${payload.name} already exists` });
        }

        const user = payload.user || rootGetters['user/getUser']?.uid;
        analytics.logEvent(`${!payload.id ? 'create' : 'update'}_exercise`);
        const ref = Exercises.doc(payload?.id);
        ref.set({ ..._.pick(payload, ['name', 'sets', 'reps', 'unitType', 'amount', 'unit', 'link', 'notes']), user });
        return resolve(ref?.id);
      } catch (err) {
        console.log('upsertExercise err:', err);
        return reject(err);
      }
    });
  },

  deleteExercise({ dispatch, rootGetters }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        rootGetters['routine/getRoutines'].forEach(v1 => {
          if(v1.exercises.find(v2 => v2 === payload)) {
            const rt = _.cloneDeep(v1);
            rt.exercises = rt.exercises.filter(v2 => v2 !== payload);
            dispatch('routine/upsertRoutine', rt, { root: true });
          }
        });

        analytics.logEvent('delete_exercise');
        Exercises.doc(payload).delete();
        return resolve();
      } catch (err) {
        console.log('deleteExercise err:', err);
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
