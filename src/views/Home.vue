<template>
  <div class="page-root" :class="{ 'bar-padding': !online }">
    <login-now-btn />

    <routines :dashboard="true" />

    <connectivity-bar />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import LoginNowBtn from '@/components/Layout/LoginNowBtn';
  import Routines from '@/components/Routine/Index';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'HomePage',

    mixins: [PageActions],

    components: { LoginNowBtn, Routines, ConnectivityBar },

    mounted() {
      this.$route.meta.bg = '3';
    },

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
  
  .page-root { // bg-number should always correspond to mounted()::this.$route.meta.bg
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-3.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root { // bg-number should always correspond to mounted()::this.$route.meta.bg
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-3.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
