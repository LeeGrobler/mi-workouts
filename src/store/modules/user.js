import _ from 'lodash';
const { auth, analytics } = require('@/plugins/firebase');

const defaultState = () => ({
  user: null,
  snaps: {},
});

const state = defaultState();

const getters = {
  getUser: state => state.user,
  getSnaps: state => state.snaps,
};

const mutations = {
  setUser: (state, payload) => state.user = payload,
  setSnaps: (state, payload) => state.snaps = payload,
  addSnaps: (state, payload) => state.snaps = {
    ...state.snaps,
    ...payload
  },
};

const actions = {
  checkFbRedirectResult({ commit, dispatch }) { // once proper logged in (i.e. not anon auth), after redirecting back from google, this is called to confirm login succeeded.
    return new Promise(async (resolve, reject) => {
      try {
        const { user } = await auth().getRedirectResult();
        const savedCredential = sessionStorage.getItem('credential');

        if(user && savedCredential) {
          const token = auth.AuthCredential.fromJSON(savedCredential);
          const credential = auth.FacebookAuthProvider.credential(token);
          user.linkWithCredential(credential);
        }

        sessionStorage.removeItem('credential');
        return resolve({ user: !!user });
      } catch (err1) {
        const errors = [
          'auth/credential-already-in-use', // login into anything -> logout -> refresh -> log into same thing
          'auth/email-already-in-use', // login into anything -> logout -> refresh -> log into anything else
          'auth/account-exists-with-different-credential', // login into google -> logout -> log into fb
        ];

        if([errors[0]].includes(err1.code)) {
          const exercises = await dispatch('exercise/fetchUserExercises', auth().currentUser.uid, { root: true });
          const routines = await dispatch('routine/fetchUserRoutines', auth().currentUser.uid, { root: true });

          try {
            exercises.forEach(v => dispatch('exercise/deleteExercise', v.id, { root: true }));
            routines.forEach(v => dispatch('routine/deleteRoutine', v.id, { root: true }));
            const { user } = await auth().signInWithCredential(err1.credential);
            dispatch('initAuthWatch');
            exercises.forEach(v => dispatch('exercise/upsertExercise', { ..._.pick(v, ['name', 'sets', 'reps', 'unitType', 'amount', 'unit', 'link', 'notes']), user: user.uid }, { root: true }));
            routines.forEach(v => dispatch('routine/upsertRoutine', { ..._.pick(v, ['name', 'notes', 'user', 'favorite', 'order']), exercises: [], user: user.uid }, { root: true }));
            return resolve({ user: !!user });
          } catch (err2) {
            console.log('auth/credential-already-in-use:', err2);
            exercises.forEach(v => dispatch('exercise/upsertExercise', { number: v.number, user: v.user }, { root: true }));
            routines.forEach(v => dispatch('routine/upsertRoutine', { number: v.number, user: v.user }, { root: true }));
            return reject(err1);
          }
        }

        if([errors[1], errors[2]].includes(err1.code)) {
          try {
            const providers = {
              google: new auth.GoogleAuthProvider(),
              facebook: new auth.FacebookAuthProvider(),
              twitter: new auth.TwitterAuthProvider(),
            };

            sessionStorage.setItem('credential', JSON.stringify(err1.credential));

            const signinMethods = await auth().fetchSignInMethodsForEmail(err1.email);
            const providerKey = signinMethods[0].split('.')[0];
            const provider = providers[providerKey];

            return commit('ui/showAlert', {
              color: 'warning',
              timeout: 60000,
              text: `Because you previously logged in via a different provider, you\'ll have to log into that account in order to link it with your existing account.`,
              onClose: () => auth().signInWithRedirect(provider),
              buttons: [
                { text: 'Cancel', callback: () => dispatch('initAuthWatch') },
                { text: 'Proceed', callback: () => auth().signInWithRedirect(provider) }
              ]
            }, { root: true });
          } catch (err2) {
            console.log('auth/account-exists-with-different-credential err:', err2);
            return reject(err1);
          }
        }

        console.log('checkFbRedirectResult err1:', err1);
        return reject(err1);
      }
    });
  },

  // inits event listener that responds to authentication changes (i.e. user logs in or out - including anon auth)
  initAuthWatch({ getters, commit, dispatch }) {
    return new Promise(async (resolve, reject) => {
      try {
        if(getters.getSnaps.auth) dispatch('unsubscribeFromSnapshot', 'auth');

        const authListener = auth().onAuthStateChanged(user => {
          if(!user) {
            console.log('creating account');
            dispatch('loginAnon');
          } else {
            console.log('assigning user:', user.uid, user.isAnonymous, user);

            const { uid, email, isAnonymous, displayName, phoneNumber, photoURL } = user;
            const providerData = user.providerData?.find(v => v.providerId === 'google.com' || v.providerId === 'facebook.com');
    
            commit('setUser', {
              uid, email, isAnonymous,
              photoURL: photoURL || providerData?.photoURL || '',
              displayName: displayName || providerData?.displayName || '',
              phoneNumber: phoneNumber || providerData?.phoneNumber || ''
            });

            analytics.setUserProperties({ user_id: user.uid });
            dispatch('exercise/fetchExercises', null, { root: true });
            dispatch('routine/fetchRoutines', null, { root: true });
          }
        });
            
        commit('addSnaps', { auth: authListener });
        return resolve();
      } catch (err) {
        console.log('initAuthWatch err:', err);
        return reject(err);
      }
    });
  },

  // logout
  logout({ commit, dispatch }) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('logging out');

        analytics.logEvent('logout');
        await dispatch('unsubscribeFromSnapshots');
        await dispatch('exercise/unsubscribeFromSnapshots', null, { root: true });
        await dispatch('routine/unsubscribeFromSnapshots', null, { root: true });
        await auth().signOut();
        commit('setUser', null);

        commit('ui/showAlert', {
          color: 'success',
          timeout: 10000,
          text: `You are now logged out. Thanks for using MiWorkouts, we hope to see you again soon!`,
        }, { root: true });

        return resolve();
      } catch (err) {
        console.log('logout err:', err);
        return reject(err);
      }
    });
  },

  // detaches auth change listener (initAuthWatch)
  unsubscribeFromSnapshots({ getters, commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const snaps = getters.getSnaps;
        Object.keys(snaps).forEach(v => snaps[v]());
        commit('setSnaps', {});
        return resolve();
      } catch (err) {
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

  loginAnon({}) { // anonymous login
    return new Promise(async (resolve, reject) => {
      try {
        await auth().signInAnonymously();
        analytics.logEvent('sign_in', { provider: 'anonymous' });
        return resolve();
      } catch (err) {
        console.log('loginAnon err:', err);
        return reject(err);
      }
    });
  },

  // facebook login
  loginWithFacebook({ getters }) {
    return new Promise(async (resolve, reject) => {
      try {
        const facebook = new auth.FacebookAuthProvider();
        analytics.logEvent('sign_in', { provider: 'facebook' });
        if(!!getters.getUser) {
          console.log('linking facebook');
          await auth().currentUser.linkWithRedirect(facebook);
        } else {
          console.log('signing in facebook');
          await auth().signInWithRedirect(facebook);
        }

        return resolve();
      } catch (err) {
        console.log('loginWithFacebook err:', err);
        return reject(err);
      }
    });
  },

  // google login
  loginWithGoogle({ getters }) {
    return new Promise(async (resolve, reject) => {
      try {
        const google = new auth.GoogleAuthProvider();
        analytics.logEvent('sign_in', { provider: 'google' });
        if(!!getters.getUser) {
          console.log('linking google');
          await auth().currentUser.linkWithRedirect(google);
        } else {
          console.log('signing in google');
          await auth().signInWithRedirect(google);
        }

        return resolve();
      } catch (err) {
        console.log('loginWithGoogle err:', err);
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
