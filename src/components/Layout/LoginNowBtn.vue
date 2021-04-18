<template>
  <v-container v-if="user.isAnonymous">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">

        <v-btn block color="secondary" dark to="/sign-in">Sign in now</v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters({ user: 'user/getUser' }),

      // user() {
      //   return { isAnonymous: false };
      // }
    }
  }
</script>

<style>

</style>