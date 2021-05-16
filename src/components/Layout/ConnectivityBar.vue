<template>
  <!--
    when you move this to App.vue, it throws some `getBoundingClientRect` error when toggling online/offline, so i'm leaving it here for now
    but if you ever feel up to the challange, please get it working in App.vue so we can try to remove these "global" components from the pages
  -->
  <transition name="slide-fade" mode="out-in">
    <v-system-bar v-if="footer && !online" :class="`${position}-bottom`" :style="{ 'bottom': position === 'fixed' ? 0 : `${footer.height}px` }" class="full-width" ref="comp-root" dark
      color="warning"
    >
      <v-spacer></v-spacer>
      <v-icon class="mr-3">mdi-wifi-strength-off-outline</v-icon>
      You're Offline
      <v-spacer></v-spacer>
    </v-system-bar>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'ConnectivityBar',

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        footer: 'ui/getFooterPos',
      }),

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
