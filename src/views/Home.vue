<template>
  <div class="page-root" :class="{ 'bar-padding': !online }">
    <login-now-btn />

    <v-container class="upsert-root white--text">
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">

          <routines :faves-only="true" />
          
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
  import Routines from '@/components/Routine/List';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'HomePage',

    mixins: [PageActions],

    components: { LoginNowBtn, Routines, ConnectivityBar },

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },

    metaInfo() {
      return { ...this.pageMeta, titleTemplate: '%s | Home' };
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
  
  // TODO: include image credit in footer
  // Photo by cottonbro from Pexels | https://www.pexels.com/photo/man-in-white-crew-neck-t-shirt-holding-black-and-white-round-frame-4761344/
  // Photo by Mister Mister from Pexels | https://www.pexels.com/photo/man-sitting-on-flat-bench-3490348/
  // Photo by Unkonwn from Pexels | https://www.pexels.com/photo/active-adult-biceps-body-416809/
  // Photo by Unkonwn from Pexels | https://www.pexels.com/photo/adult-athlete-body-bodybuilding-414029/
  // Photo by Unkonwn from Pexels | https://www.pexels.com/photo/active-adult-athlete-body-416778/
  // Photo by Li Sun from Pexels | https://www.pexels.com/photo/man-working-out-2294361/
  // Photo by Victor Freitas from Pexels | https://www.pexels.com/photo/man-about-to-lift-barbell-2261477/
  // Photo by Victor Freitas from Pexels | https://www.pexels.com/photo/man-wearing-black-shorts-lifting-heavy-barbells-841135/
  // Photo by Ketut Subiyanto from Pexels | https://www.pexels.com/photo/photo-of-man-doing-push-ups-using-yellow-kettlebell-4720236/
  // Photo by Victor Freitas from Pexels | https://www.pexels.com/photo/person-wearing-black-shorts-and-blue-lace-up-low-top-sneaker-holding-black-barbell-841131/
  // Photo by Binyamin Mellish from Pexels | https://www.pexels.com/photo/man-in-black-shorts-carrying-adjustable-barbells-116077/
  // Photo by Li Sun from Pexels | https://www.pexels.com/photo/photo-of-woman-raising-dumbbells-2475878/
  // Photo by cottonbro from Pexels | https://www.pexels.com/photo/woman-in-blue-sports-bra-and-black-leggings-doing-exercise-4753928/
  // Photo by Eduardo Romero from Pexels | https://www.pexels.com/photo/woman-lifting-two-dumbells-on-both-hands-in-front-of-mirror-1886487/
  // Photo by Leon Ardho from Pexels | https://www.pexels.com/photo/man-climbing-on-rope-2468339/

  // Photo by Erik Mclean on Unsplash | https://unsplash.com/@introspectivedsgn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
  // Photo by Erik Mclean on Unsplash | https://unsplash.com/@introspectivedsgn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText

  .page-root {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-3.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-3.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
