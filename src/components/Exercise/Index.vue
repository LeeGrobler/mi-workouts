<template>
  <v-container class="upsert-root white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
        <transition name="slide-fade" mode="out-in">

          <upsert v-if="upserting" />
          <div v-else>
            <heading v-if="exercises && exercises.length > 0" text="Exercises" role="section" />

            <list class="mt-1" />

            <v-btn block color="primary" dark to="/exercises/create" class="mt-3">
              <v-icon left>mdi-plus</v-icon>
              Create Exercise
            </v-btn>
          </div>
          
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Heading from '@/components/Layout/Heading';
  import List from '@/components/Exercise/List';
  import Upsert from '@/components/Exercise/Upsert';

  export default {
    name: 'ExerciseIndex',

    components: { Heading, List, Upsert },

    props: {
      upserting: { type: Boolean, required: false, default: false },
    },

    computed: {
      ...mapGetters({ exercises: 'exercise/getExercises' }),
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
