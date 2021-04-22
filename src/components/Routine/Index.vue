<template>
  <v-container class="upsert-root white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
        <transition name="slide-fade" mode="out-in">

          <upsert v-if="upserting && !upsertExercise" ref="upsert-routine" :routine="routine" @edit="stopEditing" @createExercise="upsertExercise = true" />
          <upsert-exercise v-else-if="upserting && upsertExercise" @edit="upsertExercise = false" :callback="exerciseCallback" />
          <div v-else>
            <v-btn block color="primary" dark @click="upserting = !upserting">
              <v-icon left>mdi-plus</v-icon>
              Create Routine
            </v-btn>

            <list @edit="startEdit" />
          </div>
          
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import List from '@/components/Routine/List';
  import Upsert from '@/components/Routine/Upsert';
  import UpsertExercise from '@/components/Exercise/Upsert';

  export default {
    name: 'RoutineIndex',

    components: { List, Upsert, UpsertExercise },

    data: () => ({
      upserting: false,
      upsertExercise: false,
      routine: null,
    }),

    methods: {
      startEdit(ex) {
        this.upserting = true;
        this.routine = ex;
      },

      stopEditing() {
        this.upserting = false;
        this.upsertExercise = false;
        this.routine = null;
      },

      exerciseCallback(ex) {
        setTimeout(() => this.$refs['upsert-routine'].addExercise(ex), 300);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
