<template>
  <div class="page-root">
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <contact-form>
            <p slot="headline" class="white--text text-h6 font-weight-regular ma-0 text-center">
              Have any comments, critiques or suggestions? Here's where you can let us know about it.
            </p>
          </contact-form>
        </v-col>
      </v-row>
    </v-container>

    <connectivity-bar />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import ContactForm from '@/components/Contact/ContactForm';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'ContactPage',

    mixins: [PageActions],

    components: { ContactForm, ConnectivityBar },

    mounted() {
      this.$route.meta.bg = '1';
    },

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Contact' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-1.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-1.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
