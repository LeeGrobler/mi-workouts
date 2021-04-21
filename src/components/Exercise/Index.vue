<template>
  <div class="comp-root">
    <upsert-exercise key="up-ex" :getUpserting="upserting" :exercise="exercise" @edit="stopEditing" @setUpserting="upserting = arguments[0]" />
    <list-exercises key="li-ex" v-if="!upserting" @edit="startEdit" />
  </div>
</template>

<script>
  import ListExercises from '@/components/Exercise/ListExercises';
  import UpsertExercise from '@/components/Exercise/UpsertExercise';

  export default {
    name: 'ExerciseIndex',

    components: { ListExercises, UpsertExercise },

    data: () => ({
      upserting: false,
      exercise: null,
    }),

    methods: {
      startEdit(ex) {
        this.upserting = true;
        this.exercise = ex;
      },
      stopEditing() {
        this.upserting = false;
        this.exercise = null;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .comp-root { width: 100%; }
</style>
