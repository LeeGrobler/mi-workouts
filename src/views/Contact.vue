<template>
  <div class="page-root" :class="{ 'bar-padding': !online }">
    <login-now-btn />

    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <contact-form>
            <p class="white--text">Have any comments, critiques or suggestions? Here's where you can let us know about it.</p>
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
  import LoginNowBtn from '@/components/Layout/LoginNowBtn';
  import ContactForm from '@/components/Contact/ContactForm';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'ContactPage',

    mixins: [PageActions],

    components: { LoginNowBtn, ContactForm, ConnectivityBar },

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
