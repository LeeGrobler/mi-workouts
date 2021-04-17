<template>
  <v-app>
    <dialogue />

    <loader v-if="!tests" />
    <v-main v-else>
      <router-view />
      <app-footer />
    </v-main>

    <alert />
  </v-app>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import redirect from '@/mixins/status-redirect';
  import Dialogue from '@/components/Layout/Dialogue';
  import Loader from '@/components/Layout/Loader';
  import AppFooter from '@/components/Layout/AppFooter';
  import Alert from '@/components/Layout/Alert';

  export default {
    name: 'App',

    mixins: [redirect],

    components: { Dialogue, Loader, AppFooter, Alert },

    async mounted() {
      this.monitorConnection();
      await this.checkFbResult();
      this.initAuthWatch();
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        tests: 'test/getTests',
      }),
    },

    methods: {
      ...mapActions({
        initAuthWatch: 'user/initAuthWatch',
        checkFbRedirectResult: 'user/checkFbRedirectResult',
        monitorConnection: 'general/monitorConnection',
      }),

      async checkFbResult() {
        try {
          const { user } = await this.checkFbRedirectResult();
          if(user) this.alert({ color: 'success', timeout: 10000, text: 'Login successful' });
        } catch(err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  #app { overflow-y: hidden; }
</style>
