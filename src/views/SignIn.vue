<template>
  <div class="page-root">
    
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <login-form>
            <p slot="headline" class="white--text text-h6 font-weight-regular ma-0 text-center">Access your workouts from any device.</p>
          </login-form>
        </v-col>
      </v-row>
    </v-container>

    <connectivity-bar />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import LoginForm from '@/components/SignIn/LoginForm';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'SignInPage',

    mixins: [PageActions],

    components: { LoginForm, ConnectivityBar },

    mounted() {
      this.$route.meta.bg = '7';
    },

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Sign In' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-7.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-7.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
