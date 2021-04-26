<template>
  <transition name="slide-fade" mode="out-in">
    <v-tabs v-if="footer" v-model="tab" @change="redirect" :class="`${position}-bottom`" :style="styles" :show-arrows="false" centered>
      <v-tab v-for="link in links" :key="link.name">
        <v-icon left>{{ link.icon }}</v-icon> {{ link.name }}
      </v-tab>
    </v-tabs>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'WorkoutBar', // Aka QuickAccessBar

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        footer: 'ui/getFooterPos',
      }),

      tab: {
        get() { return this.links.findIndex(v => v.path === this.$route.path); },
        set() {},
      },

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },

      styles() {
        if(this.position === 'fixed') {
          return { 'bottom': `${this.online ? 0 : 24}px` };
        } else {
          return { 'bottom': `${this.online ? this.footer.height : this.footer.height + 24}px` };
        }
      },

      links() {
        return this.$router.options.routes.filter(v => v.name === 'Home' || v.meta.workoutsBar);
      },
    },

    methods: {
      redirect(no) {
        const path = this.links[no].path;
        return this.$router.push(path);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  ::v-deep .v-slide-group__prev { display: none !important; }
</style>