<template>
  <div class="page-root">
    <!-- <login-now-btn /> -->

    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <donate-form>
            <p slot="headline" class="white--text text-h6 font-weight-regular ma-0">Help keep the lights on with a small contribution.</p>
          </donate-form>
        </v-col>
      </v-row>
    </v-container>

    <connectivity-bar />
  </div>
</template>

<script>
  import PageActions from '@/mixins/page-actions';
  import DonateForm from '@/components/Donate/DonateForm';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'DonatePage',

    mixins: [PageActions],

    components: { DonateForm, ConnectivityBar },

    mounted() {
      this.$route.meta.bg = '6';
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Donate' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-6.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-6.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
