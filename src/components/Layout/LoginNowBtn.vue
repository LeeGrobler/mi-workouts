<template>
  <transition name="slide-fade" mode="out-in">
    <v-container v-if="show">
      <v-row>
        <v-col cols="12" class="pa-0">

          <v-btn block color="secondary" dark to="/sign-in" class="rounded-0 py-6">
            <v-icon left>mdi-login-variant</v-icon>
            Sign in now
          </v-btn>

        </v-col>
      </v-row>
    </v-container>
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