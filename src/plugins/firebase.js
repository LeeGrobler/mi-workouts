import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
});

const analytics = firebase.analytics();
const auth = firebase.auth;

// firebase.app().functions('europe-west2').useEmulator('localhost', 5001);
const func = {
  contact: firebase.app().functions('europe-west2').httpsCallable('contact'),
  botcheck: firebase.app().functions('europe-west2').httpsCallable('validateRecaptcha'),
  generatePayment: firebase.app().functions('europe-west2').httpsCallable('generatePayment'),
  startAccountMerge: firebase.app().functions('europe-west2').httpsCallable('startAccountMerge'),
  completeAccountMerge: firebase.app().functions('europe-west2').httpsCallable('completeAccountMerge'),
  cancelAccountMerge: firebase.app().functions('europe-west2').httpsCallable('cancelAccountMerge'),
};

const db = firebase.firestore();
db.enablePersistence();
const Payments = db.collection('payments');
const Exercises = db.collection('exercises');
const Routines = db.collection('routines');
const Affiliates = db.collection('affiliates');

export { firebase, analytics, auth, func, db, Exercises, Routines, Payments, Affiliates };
