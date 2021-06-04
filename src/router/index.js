
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Exercises from '../views/core/Exercises.vue';
import Routines from '../views/core/Routines.vue';
import SignIn from '../views/SignIn.vue';
import Account from '../views/Account.vue';
import Contact from '../views/Contact.vue';
import Donate from '../views/Donate.vue';
import Payment from '../views/Payment.vue';
import TsAndCs from '../views/legal/TsAndCs.vue';
import PrivacyPolicy from '../views/legal/PrivacyPolicy.vue';
import NotFound from '../views/NotFound';
import store from "@/store";
import { analytics } from '@/plugins/firebase';

Vue.use(VueRouter);

/*+---------+--------+------+--------+
  |         | authed | anon | online |
  +---------+--------+------+--------+
  | Home    |   Y    |  E   |   E    |
  | SignIn  |   E    |  Y   |   Y    |
  | Contact |   Y    |  E   |   Y    |
  | Ts&Cs   |   E    |  E   |   E    |
  | Privacy |   E    |  E   |   E    |
  | Logout  |   Y    |  N   |   Y    |
  +---------+--------+------+--------+
  Y = required
  E = either
  N = unauthed only; unanon only; offline only

  ----

  navbar: T = top; B = bottom; S = special (i.e. bottom button lol)
*/

const routes = [
  // drawer
  { path: '/',          name: 'Home',      icon: 'mdi-home',             component: Home,      meta: { auth: 'Y', anon: 'E', online: 'E', navbar: 'T', showPromo: true, loginBtn: true, workoutsBar: true } },
  { path: '/exercises', name: 'Exercises', icon: 'mdi-dumbbell',         component: Exercises, meta: { auth: 'Y', anon: 'E', online: 'E', navbar: 'T', showPromo: true, loginBtn: true, workoutsBar: true } },
  { path: '/routines',  name: 'Routines',  icon: 'mdi-arm-flex-outline', component: Routines,  meta: { auth: 'Y', anon: 'E', online: 'E', navbar: 'T', showPromo: true, loginBtn: true, workoutsBar: true } },
  { path: '/sign-in',   name: 'Sign In',   icon: 'mdi-login-variant',    component: SignIn,    meta: { auth: 'E', anon: 'Y', online: 'Y', navbar: 'T', showPromo: true } },
  { path: '/account',   name: 'Account',   icon: 'mdi-account',          component: Account,   meta: { auth: 'Y', anon: 'N', online: 'Y', navbar: 'B', showPromo: true } },
  { path: '/contact',   name: 'Contact',   icon: 'mdi-email',            component: Contact,   meta: { auth: 'Y', anon: 'E', online: 'Y', navbar: 'B', showPromo: true, loginBtn: true, recaptchaBadge: true } },
  { path: '/donate',    name: 'Donate',    icon: 'mdi-gift-outline',     component: Donate,    meta: { auth: 'Y', anon: 'E', online: 'Y', navbar: 'S', showPromo: true, loginBtn: true, recaptchaBadge: true } },
  { path: '/logout',    name: 'Logout',    icon: 'mdi-logout-variant',                         meta: { auth: 'Y', anon: 'N', online: 'Y', navbar: 'B' } },

  // footer
  { path: '/legal/terms-and-conditions', name: 'Terms And Conditions', icon: 'mdi-script-text-outline',    component: TsAndCs,       meta: { auth: 'E', anon: 'E', online: 'E', footer: 'Y' } },
  { path: '/legal/privacy-policy',       name: 'Privacy Policy',       icon: 'mdi-clipboard-text-outline', component: PrivacyPolicy, meta: { auth: 'E', anon: 'E', online: 'E', footer: 'Y' } },

  // other
  { path: '/exercises/:action/:id?', name: 'CreateExercise', component: Exercises, meta: { auth: 'Y', anon: 'E', online: 'E', showPromo: true, loginBtn: true }, props: { upserting: true } },
  { path: '/routines/:action/:id?',  name: 'CreateRoutine',  component: Routines,  meta: { auth: 'Y', anon: 'E', online: 'E', showPromo: true, loginBtn: true }, props: { upserting: true } },
  { path: '/payment-complete',       name: 'Payment',        component: Payment,   meta: { auth: 'Y', anon: 'E', online: 'Y', showPromo: true, loginBtn: true } },
  { path: '/*',                      name: '404',            component: NotFound,  meta: { auth: 'E', anon: 'E', online: 'E', showPromo: true, loginBtn: true } },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.from = null;

router.beforeEach(async (to, from, next) => {
  if(to.name === 'Logout') return store.dispatch('user/logout');

  analytics.logEvent('page_view', { type: 'internal' });

  router.from = from.path;

  return next();
});

export default router;
