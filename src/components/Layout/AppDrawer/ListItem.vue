<template>
  <v-list-item active-class="primary white--text" :to="link.path" link v-bind="$attrs" v-on="$listeners">
    <v-list-item-icon v-if="!link.icon" class="text-caption text-uppercase justify-center ml-1 my-2 align-self-center">
      {{ $data._.startCase(link.name) }}
    </v-list-item-icon>

    <v-list-item-avatar v-if="link.avatar">
      <v-img :src="link.avatar" />
    </v-list-item-avatar>

    <v-list-item-icon v-if="link.icon" class="my-2 align-self-center">
      <v-icon v-text="link.icon" />
    </v-list-item-icon>

    <v-list-item-content v-if="link.name" class="ml-n5">
      <v-list-item-title v-text="$data._.startCase(link.name)" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    name: 'AppDrawerListItem',

    props: {
      link: { type: Object, default: () => ({}) },
    },

    data() {
      return { _ }
    },

    computed: {
      title () {
        return _.startCase(this.link.name);
      },
    },
  }
</script>
