<template>
  <div class="page-root py-8" :class="{ 'bar-padding': !online }">
    <app-drawer />

    <page-header text="Contact" />

    <v-container class="mt-8">
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <contact-form>
            <p class="white--text">Have any comments, critiques or suggestions? Here's where you can let us know about it.</p>
          </contact-form>
        </v-col>
      </v-row>
    </v-container>

    <connectivity-bar v-if="footer" :class="`${position}-bottom`" :style="{ 'bottom': position === 'fixed' ? 0 : `${footer.height}px` }" class="full-width" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import AppDrawer from '@/components/Layout/AppDrawer';
  import PageHeader from '@/components/Layout/PageHeader';
  import ContactForm from '@/components/Contact/ContactForm';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'ContactPage',

    components: { AppDrawer, PageHeader, ContactForm, ConnectivityBar },

    async mounted() {
      await this.$recaptchaLoaded();
      this.$recaptchaInstance.showBadge();
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline' ,
        footer: 'ui/getFooterPos'
      }),

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Contact' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/image/bg-mobile-2.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-1.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
