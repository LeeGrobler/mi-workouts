<template>
  <v-list expand nav v-bind="$attrs" v-on="$listeners">
    <template v-for="(link, i) in links">
      <list-group v-if="link.links" :key="`group-${i}`" :link="link" :bottom="bottom" />
      <list-item v-else :key="`link-${i}`" :link="link" :dense="bottom" />
    </template>
  </v-list>
</template>

<script>
  import ListGroup from '@/components/Layout/AppDrawer/ListGroup';
  import ListItem from '@/components/Layout/AppDrawer/ListItem';

  export default {
    name: 'AppDrawerList',

    components: { ListGroup, ListItem },

    props: {
      links: { type: Array, default: () => ([]) },
      bottom: { type: Boolean, default: false },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
