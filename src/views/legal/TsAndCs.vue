<template>
  <div>
    <tsAndCs />
    <connectivity-bar />
  </div>
</template>

<script>
  import PageActions from '@/mixins/page-actions';
  import TsAndCs from '@/components/Legal/TsAndCs';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'TsAndCsPage',

    mixins: [PageActions],

    components: { TsAndCs, ConnectivityBar },

    async mounted() {
      window.scroll({ top: 0,  left: 0,  behavior: 'smooth' });
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Terms And Conditions' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
