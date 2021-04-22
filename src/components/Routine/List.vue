<template>
  <v-list class="list-root mt-3 py-0"  color="transparent">

    <transition-group name="list">
      <v-list-group v-for="rt in routines" :key="rt.id">
        <template v-slot:activator>
          <!-- deets -->
          <v-list-item-content class="py-0">
            <v-list-item-title class="white--text">{{ rt.name }}</v-list-item-title>
            <v-list-item-subtitle class="white--text">{{ getDetailsText(rt) }}</v-list-item-subtitle>
          </v-list-item-content>
          <!-- actions -->
          <v-list-item-action class="my-6px">
            <v-btn x-small icon @click="remove(rt)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
            <v-btn x-small icon @click="$emit('edit', rt)">
              <v-icon color="success">mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </template>

        <!-- card -->
        <v-list-item class="expanded-item">
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              <v-divider color="white" />

              <v-card color="transparent">
                <v-card-text class="px-0 pt-1 pb-2 white--text">{{ rt.notes }}</v-card-text>
                <exercise-list :hide-filter="true" :list-exercises="getExercisesFromId(rt.exercises)" />
              </v-card>
              
              <v-divider color="white" :class="{ 'mt-3': rt.exercises.length > 0 }" />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </transition-group>

  </v-list>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import ExerciseList from '@/components/Exercise/List';

  export default {
    name: 'ListRoutines',

    components: { ExerciseList },

    data: () => ({
      routines: [],
    }),

    mounted() {
      this.routines = _.cloneDeep(this.getRoutines);
    },

    computed: {
      ...mapGetters({
        exercises: 'exercise/getExercises',
        getRoutines: 'routine/getRoutines',
      }),
    },

    methods: {
      ...mapActions({
        setEdit: 'routine/setEdit',
        delete: 'routine/deleteRoutine'
      }),

      getIcon(category) {
        switch(category) {
          case 'Weight': return 'mdi-weight-kilogram';
          case 'Time': return 'mdi-timer-outline';
          case 'Distance': return 'mdi-run-fast';
          case 'Calories': return 'mdi-fire';
        }
      },

      getDetailsText(v) {
        let str = v.sets ? v.sets + ' x ' : '';
        str += v.reps ? v.reps + ' @ ' : '';
        str += v.amount ? v.amount + ' ' : '';
        str += v.amount && v.unit ? v.unit : '';

        return str.trim();        
      },

      remove(ex) {
        this.dialogue({
          color: 'error',
          title: `Delete Routine`,
          text: `Are you sure you want to delete ${ex.name}?`,
          actions: [{ text: 'No' }, {
            color: 'error',
            callback: async () => {
              try {
                ex.loading = true;
                await this.delete(ex.id);
                this.alert({ color: 'success', timeout: 10000, text: `${ex.name} successfully deleted` });
              } catch (err) {
                this.alert({ color: 'error', timeout: 10000, text: err.message });
                ex.loading = false;
              }
            },
            text: 'Yes, Delete'
          }],
        });
      },

      getExercisesFromId(exs) {
        return exs.map(v => _.cloneDeep(this.exercises.find(v2 => v2.id === v)));
      },
    },

    watch: {
      getRoutines(n) {
        this.routines = _.cloneDeep(n);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/animate.scss";

  ::v-deep .v-list-item {
    padding: 0;
    min-height: 0;
  }

  ::v-deep .v-list-group__header__append-icon i { color: #fff; }
  ::v-deep .v-list-item__action--stack { flex-direction: unset; }
  ::v-deep .v-application--is-ltr .v-card__actions > .v-btn.v-btn + .v-btn { margin-left: 0; }

  ::v-deep .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
    margin-left: 0;
    min-width: unset;
  }

  .expanded-item { min-height: unset; }

  .my-6px {
    margin-top: 6px !important;
    margin-bottom: 6px !important;
  }
</style>
