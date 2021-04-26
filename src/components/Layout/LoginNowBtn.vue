<template>
  <transition name="slide-fade" mode="out-in">
    <div>
      <v-btn v-if="show" color="secondary" to="/sign-in" class="rounded-0 py-6" block dark>
        <v-icon left>mdi-login-variant</v-icon>
        Sign in now
      </v-btn>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'LoginNowBtn',

    computed: {
      ...mapGetters({
        user: 'user/getUser',
        online: 'general/getOnline',
      }),

      show() {
        return this.user?.isAnonymous && this.online;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>