<template>
  <div class="page-root justify-top" :class="{ 'bar-padding': !online }">
    <login-now-btn />

    <index />
    
    <connectivity-bar v-if="footer" :class="`${position}-bottom`" :style="{ 'bottom': position === 'fixed' ? 0 : `${footer.height}px` }" class="full-width" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import LoginNowBtn from '@/components/Layout/LoginNowBtn';
  import Index from '@/components/Exercise/Index';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'ExercisesPage',

    mixins: [PageActions],

    components: { LoginNowBtn, Index, ConnectivityBar },

    async mounted() {
      await this.$recaptchaLoaded();
      this.$recaptchaInstance.hideBadge();
    },

    computed: {
      ...mapGetters({
        user: 'user/getUser',
        online: 'general/getOnline' ,
        footer: 'ui/getFooterPos'
      }),

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Exersises' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/image/bg-mobile-4.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../../assets/image/bg-desktop-4.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
