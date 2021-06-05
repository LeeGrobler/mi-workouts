<template>
  <div class="comp-root" :class="[css.opacity]">

    <h1 :class="css.fontSize">{{ text }}</h1>
    <div class="bar" />

    <v-tooltip v-for="(btn, i) in buttons" :key="i" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" :loading="btn.loading" :disabled="btn.diabled" :small="role === 'page'" :x-small="role !== 'page'" :class="{ 'ml-2': role !== 'subtitle' }" fab
          outlined @click="!!btn.callback && btn.callback()" class="btn"
        ><v-icon color="white">{{ btn.icon }}</v-icon></v-btn>
      </template>
      <span>{{ btn.text }}</span>
    </v-tooltip>

  </div>
</template>

<script>
  export default {
    name: 'Heading',

    props: {
      text: { type: String, required: true },
      role: { type: String, default: 'page' },
      buttons: { type: Array, default: () => [] },
    },

    computed: {
      css() {
        switch(this.role) {
          case 'page': 
            return { fontSize: 'text-h4' }
          case 'section': 
            return {
              fontSize: 'text-h5',
              opacity: 'role-section'
            }
          case 'subtitle': 
            return {
              fontSize: 'text-h6',
              opacity: 'role-subtitle'
            }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .theme--light.v-btn.v-btn--disabled .v-icon,
  .theme--light.v-btn.v-btn--disabled .v-btn__loading { color: #fff !important; }

  .comp-root {
    display: flex;
    align-items: center;
    white-space: nowrap;
    color: #fff;

    h1 { font-weight: 400; }

    &.role-subtitle {
      .bar { background-color: #fff; }
      .btn { border: none; }
    }

    .bar {
      height: 2px;
      width: 100%;
      margin-left: 10px;
      background-color: #fff;
    }

    .btn {
      border: 2px solid #fff;

      .v-icon { color: #fff; }
    }
  }
</style>