<template>
  <div class="comp-root text-center">
    <slot name="headline"></slot>

    <div v-if="online" class="provider-btns my-8">
      <v-btn block :disabled="!!loading" :loading="loading === 'facebook'" x-large color="#3B5998" dark class="my-2" @click="facebookLogin">
        <v-icon left>mdi-facebook</v-icon>
        Facebook
      </v-btn>

      <v-btn block :disabled="!!loading" :loading="loading === 'google'" x-large color="#DB4437" dark class="my-2" @click="googleLogin">
        <v-icon left>mdi-google</v-icon>
        Google
      </v-btn>

      <!-- <v-btn block :disabled="!!loading" :loading="loading === 'twitter'" x-large color="#1DA1F2" dark class="my-2">
        <v-icon left>mdi-twitter</v-icon>
        Twitter
      </v-btn> -->
    </div>

    <router-link v-if="!!user" to="/" class="white--text text-body-1 font-weight-regular text-decoration-none block-el">Not Now</router-link>
    <a href="#" @click.prevent="showAccountReasons" class="white--text text-body-1 font-weight-regular text-decoration-none block-el">Why Sign In?</a>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'LoginForm',

    data: () => ({
      loading: '',
    }),

    computed: {
      ...mapGetters({
        user: 'user/getUser',
        footer: 'ui/getFooterPos',
        online: 'general/getOnline',
      }),
    },

    methods: {
      ...mapActions({
        loginWithFacebook: 'user/loginWithFacebook',
        loginWithGoogle: 'user/loginWithGoogle',
      }),

      async facebookLogin() {
        try {
          this.loading = 'facebook';
          await this.loginWithFacebook();
        } catch (err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }
        this.loading = null;
      },

      async googleLogin() {
        try {
          this.loading = '';
          await this.loginWithGoogle();
        } catch (err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }
        this.loading = null;
      },

      showAccountReasons() {
        this.dialogue({
          title: 'MiWorkouts Sign In',
          text: `
            By signing into MiWorkouts, your Excersises and Routines become accessible on any device so
            if you get a new phone, or would like to create a plan on your pc, to use on your cell phone,
            you can simply sign in on the other device and instantly access everything you created on the
            first device.
          `,
          actions: [{
            color: 'success',
            text: 'Awesome, thanks!'
          }],
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>