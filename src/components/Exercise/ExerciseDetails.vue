<template>
  <v-list-item-content>
    <v-list-item-title>{{ exercise.name }}</v-list-item-title>
    <v-list-item-subtitle>{{ getDetailsText }}</v-list-item-subtitle>
  </v-list-item-content>
</template>

<script>
  export default {
    name: 'ExerciseDetails',

    props: {
      exercise: { type: Object, required: true },
    },

    computed: {
      getDetailsText() {
        let str = this.exercise.sets ? this.exercise.sets + ' x ' : '';
        str += this.exercise.reps ? this.exercise.reps + ' @ ' : '';
        str += this.exercise.amount ? this.exercise.amount + ' ' : '';
        str += this.exercise.amount && this.exercise.unit ? this.exercise.unit : '';

        return str.trim();
      }
    },
  }
</script>

<style lang="scss" scoped>
</style>
