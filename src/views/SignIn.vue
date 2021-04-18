<template>
  <div class="page-root" :class="{ 'bar-padding': !online }">
    
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <login-form>
            <p slot="headline" class="white--text text-h6 font-weight-regular ma-0">Access your workouts from any device.</p>
          </login-form>
        </v-col>
      </v-row>
    </v-container>

    <connectivity-bar v-if="footer" :class="`${position}-bottom`" :style="{ 'bottom': position === 'fixed' ? 0 : `${footer.height}px` }" class="full-width" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import LoginForm from '@/components/SignIn/LoginForm';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'LoginPage',

    mixins: [PageActions],

    components: { LoginForm, ConnectivityBar },

    async mounted() {
      await this.$recaptchaLoaded();
      this.$recaptchaInstance.hideBadge();
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline' ,
        footer: 'ui/getFooterPos'
      }),

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Sign In' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/image/bg-mobile-1.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-1.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
