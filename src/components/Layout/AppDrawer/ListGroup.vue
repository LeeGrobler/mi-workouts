<template>
  <v-list-group :group="group" :prepend-icon="link.icon" eager v-bind="$attrs">
    <template v-slot:activator>
      <v-list-item-icon v-if="!link.icon && !link.avatar" class="text-caption text-uppercase text-center my-2 align-self-center" style="margin-top: 14px">
        {{ title }}
      </v-list-item-icon>

      <v-list-item-avatar v-if="link.avatar">
        <v-img :src="link.avatar" />
      </v-list-item-avatar>

      <v-list-item-content v-if="link.title">
        <v-list-item-title v-text="link.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in link.links">
      <default-list-group v-if="child.links" :key="`sub-group-${i}`" :link="child" />
      <list-item v-if="!child.links" :key="`child-${i}`" :link="child" :dense="bottom" />
    </template>
  </v-list-group>
</template>

<script>
  export default {
    name: 'AppDrawerListGroup',

    props: {
      link: { type: Object, default: () => ({}) },
      bottom: { type: Boolean, default: false },
    },

    computed: {
      group () {
        return this.genGroup(this.link.items)
      },
      title () {
        const matches = this.link.title.match(/\b(\w)/g)
        return matches.join('')
      },
    },

    methods: {
      genGroup (items) {
        return items.reduce((acc, cur) => {
          if (!cur.to) return acc
          acc.push(cur.items ? this.genGroup(cur.items) : cur.to.slice(1, -1))
          return acc
        }, []).join('|')
      },
    },
  }
</script>
