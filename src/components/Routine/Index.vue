<template>
  <v-container class="upsert-root white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
        <transition name="slide-fade" mode="out-in">

          <upsert v-if="upserting" />
          <div v-else>
            <heading v-if="routines && routines.length > 0" text="Routines" role="section" />

            <list class="mt-3" />

            <v-btn block color="primary" dark to="/routines/create" class="mt-3">
              <v-icon left>mdi-plus</v-icon>
              Create Routine
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
  import List from '@/components/Routine/List';
  import Upsert from '@/components/Routine/Upsert';
  import UpsertExercise from '@/components/Exercise/Upsert';

  export default {
    name: 'RoutineIndex',

    components: { Heading, List, Upsert, UpsertExercise },

    props: {
      upserting: { type: Boolean, required: false, default: false },
    },

    computed: {
      ...mapGetters({ routines: 'routine/getRoutines' }),
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
