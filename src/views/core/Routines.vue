<template>
  <div class="page-root justify-top">
    <index :upserting="upserting" />
    
    <connectivity-bar />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import Index from '@/components/Routine/Index';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'RoutinesPage',

    mixins: [PageActions],

    components: { Index, ConnectivityBar },

    props: {
      upserting: { type: Boolean, required: false, default: false },
    },

    mounted() {
      this.$route.meta.bg = '4';
    },

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Routines' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../../assets/image/bg-mobile-4.jpg') no-repeat center center fixed;
    background-size: cover;
    padding-bottom: 48px;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../../assets/image/bg-desktop-4.jpg') no-repeat center center fixed;
      background-size: cover;
      padding-bottom: 48px;
    }
  }
</style>
