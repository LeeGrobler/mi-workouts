<template>
  <div class="page-root justify-top" :class="{ 'bar-padding': !online }">
    <login-now-btn />

    <!-- <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">

          <v-btn v-if="user.isAnonymous" block  color="primary" dark to="/sign-in">Sign in now</v-btn>

        </v-col>
      </v-row>
    </v-container> -->

    <!-- <test /> -->
    <connectivity-bar />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import LoginNowBtn from '@/components/Layout/LoginNowBtn';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'PlansPage',

    mixins: [PageActions],

    components: { LoginNowBtn, ConnectivityBar },

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Home' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../../assets/image/bg-mobile-5.jpg') no-repeat center center fixed;
    background-size: cover;
    padding-bottom: 48px;

    &.bar-padding { padding-bottom: 72px; }
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../../assets/image/bg-desktop-5.jpg') no-repeat center center fixed;
      background-size: cover;
      padding-bottom: 48px;

      &.bar-padding { padding-bottom: 72px; }
    }
  }
</style>
