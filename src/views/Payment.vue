<template>
  <div class="page-root">
    <login-now-btn />

    <v-container>
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <heading text="Payment Complete" role="section" />

          <p v-if="status && status === 'complete'" slot="headline" class="white--text text-h6 font-weight-regular mt-8">
            Knowing that we are in a time of financial instability, your donation is extra special to us. Thank you for your generous
            financial support during this tumultuous time. Your contribution will help keep the lights on and improve the app.
          </p>
          <p v-if="status && status !== 'complete'" slot="headline" class="white--text text-h6 font-weight-regular mt-8">
            Unfortunately we couldn't process your donation due to the following reason: "{{ status }}"
          </p>

          <router-link to="/" class="secondary--text text-decoration-none">Home</router-link>
        </v-col>
      </v-row>
    </v-container>

    <promo />
    <connectivity-bar />
  </div>
</template>

<script>
  const { Payments } = require('@/plugins/firebase');
  import PageActions from '@/mixins/page-actions';
  import LoginNowBtn from '@/components/Layout/LoginNowBtn';
  import Heading from '@/components/Layout/Heading';
  import Promo from '@/components/Layout/Promo';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'DonatePage',

    mixins: [PageActions],

    components: { LoginNowBtn, Heading, Promo, ConnectivityBar },

    data: () => ({ status: null }),

    async created() {
      if(!this.$route.query.id) {
        this.alert({ color: 'warning', timeout: 10000, text: 'An unknown error occurred [1]' });
        return this.$router.push('/');
      }

      try {
        const payment = await Payments.doc(this.$route.query.id).get();

        if(!payment) {
          this.alert({ color: 'warning', timeout: 10000, text: 'An unknown error occurred [2]' });
          return this.$router.push('/');
        }

        this.status = payment.data().status;
      } catch(err) {
        console.log('get payment err:', err);
        this.alert({ color: 'warning', timeout: 10000, text: err.message });
        return this.$router.push('/');
      }
    },

    mounted() {
      this.$route.meta.bg = '5';
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Payment Complete' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-5.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-5.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
