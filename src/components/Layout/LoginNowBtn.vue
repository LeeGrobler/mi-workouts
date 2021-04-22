<template>
  <v-container v-if="show">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4" class="pa-0">

        <v-btn block color="secondary" dark to="/sign-in" class="rounded-0 py-6">
          <v-icon left>mdi-login-variant</v-icon>
          Sign in now
        </v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'LoginNowBtn',

    computed: {
      ...mapGetters({ user: 'user/getUser' }),

      show() {
        return this.user?.isAnonymous;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>