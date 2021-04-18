<template>
  <div class="comp-root">

    <v-app-bar color="primary" flat dense dark :fixed="fixed">
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click="drawer = !drawer" />
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer id="default-drawer" v-model="drawer" :mini-variant.sync="mini" mini-variant-width="80" width="260" app v-click-outside="clickedOutside">
      <div class="px-2">
        <!-- Header -->
        <v-list-item class="mb-0 justify-space-between pl-3">
          <v-list-item-avatar>
            <v-img :src="require('@/assets/image/logo.png')" />
          </v-list-item-avatar>

          <v-list-item-content class="pl-2">
            <v-list-item-title class="text-h6">
              <strong class="font-weight-black">Mi</strong>
              <span class="primary--text move-left">Workouts</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mx-3 mb-2" />

        <list :links="links.filter(v => v.meta.navbar === 'T')" />
      </div>

      <template #append>
        <div class="px-2">
          <list :links="links.filter(v => v.meta.navbar === 'B')" :bottom="true" />
        </div>

        <!-- <div class="pa-4 text-center">
          <app-btn block class="text-none" color="secondary" href="https://store.vuetifyjs.com/products/vuetify-material-dashboard-pro">
            <v-icon left>mdi-package-up</v-icon>
            Upgrade to Pro
          </app-btn>
        </div> -->
      </template>

      <div class="pt-12" />
    </v-navigation-drawer>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import List from '@/components/Layout/AppDrawer/List';

  export default {
    name: 'AppDrawerComponent',

    components: { List },

    props: {
      fixed: { type: Boolean, default: false, required: false }
    },

    mounted() {
      if(this.$vuetify.breakpoint.mdAndUp) this.setDrawer(true);
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        getDrawer: 'ui/getDrawer',
        getMini: 'ui/getMini',
        user: 'user/getUser',
      }),

      links() {
        const auth = !!this.user;
        const anon = this.user?.isAnonymous;
        const online = this.online;

        return this.$router.options.routes.filter(v => 
          !!v.meta.navbar &&
          (v.meta.auth === 'E' || v.meta.auth === (auth ? 'Y' : 'N')) &&
          (v.meta.anon === 'E' || v.meta.anon === (anon ? 'Y' : 'N')) &&
          (v.meta.online === 'E' || v.meta.online === (online ? 'Y' : 'N'))
        );
      },
      drawer: {
        get() { return this.getDrawer; },
        set(v) {
          if(this.$vuetify.breakpoint.smAndDown) {
            this.setDrawer(v);
            this.setMini(false);
          }
        },
      },
      mini: {
        get() { return this.getMini; },
        set(v) { this.setMini(v); },
      },
    },

    methods: {
      ...mapActions({
        setDrawer: 'ui/setDrawer',
        setMini: 'ui/setMini',
      }),

      clickedOutside() {
        if(this.$vuetify.breakpoint.mdAndUp) this.mini = true;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .comp-root { width: 100%; }

  #default-drawer {
    .v-list-item { margin-bottom: 8px; }

    .v-list-item::before,
    .v-list-item::after { display: none; }

    .v-list-group__header__prepend-icon,
    .v-list-item__icon {
      margin-top: 12px;
      margin-bottom: 12px;
      margin-left: 4px;
    }

    &.v-navigation-drawer--mini-variant {
      .v-list-item { justify-content: flex-start !important; }
    }
  }
</style>
