<template>
  <v-footer ref="comp-root" dark padless>
    <v-card flat tile class="text-center full-width">
      <v-card-text class="py-1">
        <v-btn v-for="v in somo" :key="v.icon" class="mx-4 white--text" icon @click="v.callback">
          <v-icon size="24px">{{ v.icon }}</v-icon>
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <div class="links py-1">
        <router-link v-for="link in links" :key="link.path" :to="link.path" class="white--text text-decoration-none block-el">{{ link.name }}</router-link>
      </div>

      <v-divider></v-divider>

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
        somo: [
          { icon: 'mdi-facebook', callback: () => this.alert({ color: 'info', timeout: 10000, text: 'Coming soon!' }) },
          { icon: 'mdi-twitter', callback: () => this.alert({ color: 'info', timeout: 10000, text: 'Coming soon!' }) },
          { icon: 'mdi-linkedin', callback: () => this.alert({ color: 'info', timeout: 10000, text: 'Coming soon!' }) },
          { icon: 'mdi-instagram', callback: () => this.alert({ color: 'info', timeout: 10000, text: 'Coming soon!' }) },
        ],
      };
    },

    created() {
      window.addEventListener("scroll", this.handleScroll);
    },

    mounted() {
      this.handleScroll();
    },

    destroyed() {
      window.removeEventListener("scroll", this.handleScroll);
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        user: 'user/getUser',
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

      handleScroll() {
        this.setFooterPos(this.$refs['comp-root'].$el.getBoundingClientRect());
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
