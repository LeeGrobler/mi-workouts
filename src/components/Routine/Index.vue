<template>
  <v-container class="upsert-root white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
        <transition name="slide-fade" mode="out-in">

          <upsert v-if="upserting && !upsertExercise" ref="upsert-routine" :routine="routine" @edit="stopEditing" @createExercise="upsertExercise = true" />
          <upsert-exercise v-else-if="upserting && upsertExercise" :callback="exerciseCallback" :exercise="exercise" @edit="stopExerciseUpsert" />
          <div v-else>
            <heading v-if="dashboard" text="Routines" role="section" />
            <v-btn v-else block color="primary" dark @click="upserting = !upserting">
              <v-icon left>mdi-plus</v-icon>
              Create Routine
            </v-btn>

            <list :faves-only="dashboard" @edit="startEdit" @editExercise="startExerciseEdit" />
          </div>
          
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Heading from '@/components/Layout/Heading';
  import List from '@/components/Routine/List';
  import Upsert from '@/components/Routine/Upsert';
  import UpsertExercise from '@/components/Exercise/Upsert';

  export default {
    name: 'RoutineIndex',

    components: { Heading, List, Upsert, UpsertExercise },

    props: {
      dashboard: { type: Boolean, required: false, default: false },
    },

    data: () => ({
      upserting: false,
      routine: null,
      upsertExercise: false,
      exercise: null,
    }),

    methods: {
      startEdit(rt) {
        this.upserting = true;
        this.routine = rt;
      },

      stopEditing() {
        this.upserting = false;
        this.upsertExercise = false;
        this.routine = null;
      },

      startExerciseEdit(ex) {
        this.upserting = true;
        this.exercise = ex;
        this.upsertExercise = true;
      },

      stopExerciseUpsert() {
        if(!this.exercise) return this.upsertExercise = false;
        this.upserting = false;
        this.exercise = null;
        this.exerciseCallback = null;
      },

      exerciseCallback(ex) {
        setTimeout(() => {
          if(!!this.$refs['upsert-routine']) {
            this.$refs['upsert-routine'].addExercise(ex);
          }
        }, 300);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
