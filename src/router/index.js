
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SignIn from '../views/SignIn.vue';
import Contact from '../views/Contact.vue';
import TsAndCs from '../views/TsAndCs.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
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
*/


const routes = [
  // drawer
  { path: '/',        name: 'Home',    icon: 'mdi-home',           component: Home,    meta: { auth: 'Y', anon: 'E', online: 'E', navbar: 'T' } },
  { path: '/sign-in', name: 'Sign In', icon: 'mdi-login-variant',  component: SignIn,  meta: { auth: 'E', anon: 'Y', online: 'Y', navbar: 'T' } },
  { path: '/contact', name: 'Contact', icon: 'mdi-email',          component: Contact, meta: { auth: 'Y', anon: 'E', online: 'Y', navbar: 'B' } },
  { path: '/logout',  name: 'Logout',  icon: 'mdi-logout-variant',                     meta: { auth: 'Y', anon: 'N', online: 'Y', navbar: 'B' } },

  // footer
  { path: '/terms-and-conditions', name: 'Terms And Conditions', icon: 'mdi-script-text-outline',    component: TsAndCs,       meta: { auth: 'E', anon: 'E', online: 'E', footer: 'Y' } },
  { path: '/privacy-policy',       name: 'Privacy Policy',       icon: 'mdi-clipboard-text-outline', component: PrivacyPolicy, meta: { auth: 'E', anon: 'E', online: 'E', footer: 'Y' } },

  // other
  { path: '/404', name: 'NotFound', component: NotFound, meta: { auth: 'E', anon: 'E', online: 'E' } },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  if(!to.matched.length) return next('/404');
  if(to.name === 'Logout') return store.dispatch('user/logout');

  analytics.logEvent('page_view', { type: 'internal' });

  console.log('directing to', to.path);
  return next();
});

export default router;
