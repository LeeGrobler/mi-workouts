<template>
  <div class="comp-root">
    <upsert-exercise />
    <list-exercises v-if="!upserting" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ListExercises from '@/components/Exercise/ListExercises';
  import UpsertExercise from '@/components/Exercise/UpsertExercise';

  export default {
    name: 'ExerciseIndex',

    components: { ListExercises, UpsertExercise },

    computed: {
      ...mapGetters({ upserting: 'exercise/getUpserting' }),
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .comp-root { width: 100%; }
</style>
