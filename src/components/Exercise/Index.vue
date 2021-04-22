<template>
  <v-container class="upsert-root white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
        <transition name="slide-fade" mode="out-in">

          <upsert-exercise v-if="upserting" :exercise="exercise" @edit="stopEditing" />
          <div v-else>
            <v-btn block color="primary" dark @click="upserting = !upserting">
              <v-icon left>mdi-plus</v-icon>
              Create Exercise
            </v-btn>

            <list-exercises @edit="startEdit" />
          </div>
          
        </transition>
      </v-col>
    </v-row>
  </v-container>
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
</style>
