<template>
  <v-footer ref="comp-root" dark padless>
    <v-card flat tile class="text-center full-width">
      
      <v-card-text class="section links white--text py-3">
        <router-link v-for="link in links" :key="link.path" :to="link.path" class="white--text text-decoration-none block-el">{{ link.name }}</router-link>
      </v-card-text>

      <v-divider></v-divider>
      
      <v-card-text v-if="credit" class="section credit white--text py-3">
        <a :href="credit.link" target="_blank" class="white--text text-decoration-none block-el">{{ credit.text }}</a>
      </v-card-text>
      
      <v-divider></v-divider>

      <v-card-text class="py-1">
        <v-btn v-for="v in somo" :key="v.icon" class="mx-4 white--text" icon :href="v.href" target="_blank">
          <v-icon size="24px">{{ v.icon }}</v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text py-1">
        &#169; {{ new Date().getFullYear() }} | MiWorkouts<br />
        Made by <strong>SeriousLee</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'AppFooter',

    data: function() {
      return {
        credit: null,
        somo: [
          { icon: 'mdi-facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmi-workouts.com' },
          { icon: 'mdi-twitter', href: 'https://twitter.com/share?url=https%3A%2F%2Fmi-workouts.com' },
          { icon: 'mdi-linkedin', href: 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fmi-workouts.com' },
          // { icon: 'mdi-pinterest', href: 'https://pinterest.com/pin/create/button/?description=A+to+the+point+app+that+keeps+track+of+your+workout+plans.&media=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fmi-workouts.appspot.com%2Fo%2Fcovers%252Fcover-1.PNG%3Falt%3Dmedia%26token%3D68f17996-a847-4415-9473-5af2ca0fbad2&url=https%3A%2F%2Fmi-workouts.com' },
        ],
      };
    },

    created() {
      window.addEventListener("scroll", this.handleScroll);
    },

    mounted() {
      this.setCredit();
      this.$watch('$route.meta.bg', this.setCredit);

      this.handleScroll();
    },

    destroyed() {
      window.removeEventListener("scroll", this.handleScroll);
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        user: 'user/getUser',
        credits: 'ui/getCredits',
      }),

      links() {
        const auth = !!this.user;
        const anon = this.user?.isAnonymous;
        const online = this.online;

        return this.$router.options.routes.filter(v => 
          !!v.meta.footer &&
          (v.meta.auth === 'E' || v.meta.auth === (auth ? 'Y' : 'N')) &&
          (v.meta.anon === 'E' || v.meta.anon === (anon ? 'Y' : 'N')) &&
          (v.meta.online === 'E' || v.meta.online === (online ? 'Y' : 'N'))
        );
      },
    },

    methods: {
      ...mapActions({ setFooterPos: 'ui/setFooterPos' }),

      setCredit() {
        this.credit = this.$route.meta.bg && this.$vuetify.breakpoint ? {
          link: this.credits[this.$route.meta.bg][this.$vuetify.breakpoint.mobile ? 'mobile' : 'desktop'].link,
          text: this.credits[this.$route.meta.bg][this.$vuetify.breakpoint.mobile ? 'mobile' : 'desktop'].text,
        } : null;
      },

      handleScroll() {
        this.setFooterPos(this.$refs['comp-root'].$el.getBoundingClientRect());
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .section {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
