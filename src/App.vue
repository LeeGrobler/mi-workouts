<template>
  <v-app>
    <dialogue />
    <tour />

    <loader v-if="!exercises && !routines" />
    <v-main v-else :class="{ 'no-pointer': $tours['tutorial'].isRunning }">
      <app-drawer :fixed="$route.path.indexOf('legal/') > -1" :scrollDownALittle="scrollDownALittle" />

      <transition name="slide-fade" mode="out-in">
        <router-view />
      </transition>

      <workout-bar v-if="$route.meta.workoutsBar" />
      <app-footer />
    </v-main>

    <alert />
  </v-app>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import redirect from '@/mixins/status-redirect';
  import Dialogue from '@/components/Layout/Dialogue';
  import Tour from '@/components/Layout/Tour';
  import Loader from '@/components/Layout/Loader';
  import AppDrawer from '@/components/Layout/AppDrawer';
  import WorkoutBar from '@/components/Layout/WorkoutBar';
  import AppFooter from '@/components/Layout/AppFooter';
  import Alert from '@/components/Layout/Alert';

  export default {
    name: 'App',

    mixins: [redirect],

    components: { Dialogue, Tour, Loader, AppDrawer, WorkoutBar, AppFooter, Alert },

    async mounted() {
      this.fetchPromos();

      this.monitorConnection();
      await this.checkFbResult();
      this.initAuthWatch();

      this.scrollDownALittle(750);
      this.$watch('$route', () => this.scrollDownALittle(250));
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        exercises: 'exercise/getExercises',
        routines: 'routine/getRoutines',
      }),
    },

    methods: {
      ...mapActions({
        fetchPromos: 'general/fetchPromos',
        initAuthWatch: 'user/initAuthWatch',
        checkFbRedirectResult: 'user/checkFbRedirectResult',
        monitorConnection: 'general/monitorConnection',
      }),

      async checkFbResult() {
        try {
          const { user } = await this.checkFbRedirectResult();
          if(user) this.alert({ color: 'success', timeout: 10000, text: 'Sign in successful' });
        } catch(err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }
      },

      scrollDownALittle(ms) {
        setTimeout(() => window.scroll({ top: 48,  left: 0,  behavior: 'smooth' }), ms);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  #app {
    overflow-y: hidden;
    background: #000;
  }

  .no-pointer { pointer-events: none; }
</style>
