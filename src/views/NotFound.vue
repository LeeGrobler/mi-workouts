<template>
  <div class="page-root white--text">
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">

          <h1 class="text-h1">404</h1>
          <h4 class="text-h4">Page Not Found</h4>

          <p class="text-h6 font-weight-regular mt-10">Maybe this page moved? Got deleted? Never existed in the frist place?</p>
          <p class="text-h6 font-weight-regular">Let's go <router-link to="/" class="secondary--text text-decoration-none">Home</router-link> and try from there.</p>

        </v-col>
      </v-row>
    </v-container>

    <connectivity-bar />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'NotFoundPage',

    mixins: [PageActions],

    components: { ConnectivityBar },

    mounted() {
      this.$route.meta.bg = '404';
    },

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | 404' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('../assets/image/bg-mobile-404.jpg') no-repeat center center fixed;
    background-size: cover;
    align-items: flex-start;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('../assets/image/bg-desktop-404.jpg') no-repeat center center fixed;
      background-size: cover;
      align-items: flex-start;
    }
  }
</style>
