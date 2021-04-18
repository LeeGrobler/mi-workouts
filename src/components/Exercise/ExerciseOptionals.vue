<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>

        <p v-if="exercise.notes" :class="{ 'mb-0' : !exercise.link }" class="wrap-text">{{ exercise.notes }}</p>
        <iframe v-if="exercise.link" :src="exercise.link" frameborder="0" class="full-width" allowfullscreen></iframe>
        
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    name: 'ExerciseOptionals',

    props: {
      exercise: { type: Object, required: true },
    },
  }
</script>

<style lang="scss" scoped>
  .wrap-text { white-space: normal; }
</style>
