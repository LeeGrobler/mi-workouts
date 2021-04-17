<template>
  <div class="comp-root">
    <h1 class="text-h2 mb-8 font-weight-medium" :style="`color: ${color}`">{{ text }}</h1>
    <div class="underline" :style="`background-color: ${color}`"></div>
  </div>
</template>

<script>
  export default {
    name: 'PageHeaderComponent',

    props: {
      text: { type: String, required: true, default: 'Heading Text' },
      color: { type: String, required: false, default: '#fff' },
    }
  }
</script>

<style lang="scss" scoped>
  .underline {
    height: 4px;
    width: 100%;
  }
</style>