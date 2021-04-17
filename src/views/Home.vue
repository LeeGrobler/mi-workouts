<template>
  <div class="page-root" :class="{ 'bar-padding': !online }">
    <app-drawer />

    <!-- <div class="white--text">
      mini: {{ mini }}
      <br />
      drawer: {{ drawer }}
      <br />
      <br />
      <router-link to="/logout" class="white--text">Logout</router-link>
      <test />
    </div> -->

    <connectivity-bar v-if="footer" :class="`${position}-bottom`" :style="{ 'bottom': position === 'fixed' ? 0 : `${footer.height}px` }" class="full-width" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import redirect from '@/mixins/status-redirect';
  import Test from '@/components/Home/Test';
  import AppDrawer from '@/components/Layout/AppDrawer';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'HomePage',

    // mixins: [redirect],

    components: { Test, AppDrawer, ConnectivityBar },

    async mounted() {
      await this.$recaptchaLoaded();
      this.$recaptchaInstance.hideBadge();
    },

    computed: {
      ...mapGetters({
        mini: 'ui/getMini',
        drawer: 'ui/getDrawer',
        online: 'general/getOnline' ,
        footer: 'ui/getFooterPos'
      }),

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Home' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
  
  // Photo by cottonbro from Pexels | https://www.pexels.com/photo/man-in-white-crew-neck-t-shirt-holding-black-and-white-round-frame-4761344/
  // Photo by Mister Mister from Pexels | https://www.pexels.com/photo/man-sitting-on-flat-bench-3490348/
  // Photo by Anete Lusina from Pexels | https://www.pexels.com/photo/strong-man-training-biceps-with-dumbbells-4793224/
  // Photo by Unkonwn from Pexels | https://www.pexels.com/photo/active-adult-biceps-body-416809/
  // Photo by Unkonwn from Pexels | https://www.pexels.com/photo/adult-athlete-body-bodybuilding-414029/
  // Photo by Unkonwn from Pexels | https://www.pexels.com/photo/active-adult-athlete-body-416778/
  // Photo by Li Sun from Pexels | https://www.pexels.com/photo/man-working-out-2294361/
  // Photo by Victor Freitas from Pexels | https://www.pexels.com/photo/man-about-to-lift-barbell-2261477/

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/image/bg-mobile-3.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-3.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
