<template>
  <div class="page-root">

    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          
          <danger-zone />
          
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
  import PageActions from '@/mixins/page-actions';
  import DangerZone from '@/components/Account/DangerZone';

  export default {
    name: 'AccountPage',

    mixins: [PageActions],

    components: { DangerZone },

    mounted() {
      this.$route.meta.bg = '8';
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Account' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-8.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-8.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
