<template>
  <v-container class="white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4" class="py-0">
        <v-list two-line class="py-0">
          <template v-for="(ex, i) in exercises">

            <!-- with notes / link -->
            <v-list-group v-if="ex.link || ex.notes" :key="ex.id" v-model="actives[i]">
              <template v-slot:activator>
                <exercise-avatar :exercise="ex" />
                <exercise-details :exercise="ex" />
              </template>
              <exercise-optionals :exercise="ex" />
            </v-list-group>

            <!-- no notes / link -->
            <v-list-item v-else :key="ex.id" class="px-2">
              <exercise-avatar :exercise="ex" />
              <exercise-details :exercise="ex" />
            </v-list-item>

          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ExerciseAvatar from '@/components/Exercise/ExerciseAvatar'
  import ExerciseDetails from '@/components/Exercise/ExerciseDetails'
  import ExerciseOptionals from '@/components/Exercise/ExerciseOptionals'

  export default {
    name: 'ListExercises',

    components: { ExerciseAvatar, ExerciseDetails, ExerciseOptionals },

    data() {
      return {
        actives: this.exercises?.map(v => false) || [], // TODO: this isn't generating an array of booleans with an equal length to this.exercises, maybe use a watcher instead
      }
    },

    computed: {
      ...mapGetters({ exercises: 'exercise/getExercises' }),
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
  ::v-deep .v-list-item { padding: 0 8px; }
</style>
