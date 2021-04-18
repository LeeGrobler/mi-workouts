<template>
  <v-list-item-avatar class="my-0 mr-2">
    <v-icon class="secondary" dark>{{ getIcon(exercise.unitType) }}</v-icon>
  </v-list-item-avatar>
</template>

<script>
  export default {
    name: 'ExerciseAvatar',

    props: {
      exercise: { type: Object, required: true },
    },

    methods: {
      getIcon(category) {
        switch(category) {
          case 'Weight': return 'mdi-weight-kilogram';
          case 'Time': return 'mdi-timer-outline';
          case 'Distance': return 'mdi-run-fast';
          case 'Calories': return 'mdi-fire';
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
</style>
