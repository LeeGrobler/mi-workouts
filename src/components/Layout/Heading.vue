<template>
  <div class="comp-root" :class="[{ 'dark': dark }, css.opacity]">

    <h1 :class="css.fontSize">{{ text }}</h1>
    <div class="bar" />

    <v-tooltip v-for="(btn, i) in buttons" :key="i" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" :loading="btn.loading" :disabled="btn.diabled" class="btn ml-2" color="black" @click="btn.callback" outlined fab small>
          <v-icon>{{ btn.icon }}</v-icon>
        </v-btn>
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
      dark: { type: Boolean, default: true },
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
              opacity: 'role-subtitle'
            }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .comp-root {
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-bottom: 25px;
    color: #333;

    &.role-subtitle {
      .bar { background-color: rgba(0, 0, 0, 0.6); }
      .btn { border: 2px solid rgba(0, 0, 0, 0.6); }
    }

    &.dark {
      color: #fff;

      .bar { background-color: #fff; }

      .btn {
        border: 2px solid #fff;

        .v-icon { color: #fff; }
      }
    }

    .bar {
      height: 2px;
      width: 100%;
      margin-left: 10px;
      background-color: #333;
    }

    .btn {
      border: 2px solid #333;

      .v-icon { color: #333; }
    }
  }
</style>