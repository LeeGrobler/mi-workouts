<template>
  <v-system-bar v-if="!online" ref="comp-root" dark color="warning">
    <v-spacer></v-spacer>
    <v-icon class="mr-3">mdi-wifi-strength-off-outline</v-icon>
    You're Offline
    <v-spacer></v-spacer>
  </v-system-bar>
</template>

<script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'ConnectivityBar',

    computed: {
      ...mapGetters({ online: 'general/getOnline' }),
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
