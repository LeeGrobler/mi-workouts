<template>
  <div>
    <app-drawer :fixed="true" />
    <privacy-policy />
    <connectivity-bar v-if="footer" :class="`${position}-bottom`" :style="{ 'bottom': position === 'fixed' ? 0 : `${footer.height}px` }" class="full-width" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import redirect from '@/mixins/status-redirect';
  import AppDrawer from '@/components/Layout/AppDrawer';
  import PrivacyPolicy from '@/components/Legal/PrivacyPolicy';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'TsAndCsPage',

    // mixins: [redirect],

    components: { AppDrawer, PrivacyPolicy, ConnectivityBar },

    async mounted() {
      await this.$recaptchaLoaded();
      this.$recaptchaInstance.hideBadge();
      window.scroll({ top: 0,  left: 0,  behavior: 'smooth' });
    },
    
    computed: {
      ...mapGetters({ footer: 'ui/getFooterPos' }),

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Privacy Policy' };
    },
  }
</script>

<style lang="scss" scoped>
</style>
