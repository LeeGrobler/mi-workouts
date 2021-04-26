<template>
  <div>
    <privacy-policy />
    <connectivity-bar />
  </div>
</template>

<script>
  import PageActions from '@/mixins/page-actions';
  import PrivacyPolicy from '@/components/Legal/PrivacyPolicy';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'PrivacyPolicyPage',

    mixins: [PageActions],

    components: { PrivacyPolicy, ConnectivityBar },

    async mounted() {
      window.scroll({ top: 0,  left: 0,  behavior: 'smooth' });
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Privacy Policy' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
