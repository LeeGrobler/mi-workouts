<template>
  <v-expansion-panels class="mt-3" flat dark accordion>
    <v-expansion-panel v-for="rt in routines" :key="rt.id" class="transparent">
      <v-expansion-panel-header class="py-1 px-0">
        <div>
          <v-icon class="drag-icon" color="white">mdi-drag-vertical</v-icon>
          {{ rt.name }}
        </div>

        <div class="text-right">
          <v-btn x-small icon @click.stop="favorite(rt)">
            <v-icon :color="rt.favorite ? '#FFD700' : ''">{{ rt.favorite ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
          </v-btn>
          <v-btn x-small icon @click.stop="remove(rt)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
          <v-btn x-small icon @click.stop="$emit('edit', rt)">
            <v-icon color="success">mdi-pencil</v-icon>
          </v-btn>
        </div>
      </v-expansion-panel-header>

      <v-expansion-panel-content class="py-1 px-0">
        <v-card color="transparent">
          <v-card-text v-if="rt.notes" class="pt-1 pb-0 white--text">{{ rt.notes }}</v-card-text>
          <exercise-list :list-exercises="getExercisesFromId(rt.exercises)" @reorderExercises="reorderExercises(rt, arguments[0])" />
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { mapGetters, mapActions } from 'vuex';
  import ExerciseList from '@/components/Routine/ExerciseList';

  export default {
    name: 'ListRoutines',

    components: { Draggable, ExerciseList },

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
        delete: 'routine/deleteRoutine',
        batchReorder: 'routine/batchReorder',
        upsertRoutine: 'routine/upsertRoutine',
      }),

      async favorite(ex) {
        ex.loading = true;

        try {
          ex.favorite = !ex.favorite;
          await this.upsertRoutine(ex);
        } catch(err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }

        ex.loading = true;
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

      async reorder(el) {
        el.moved.loading = true;

        try {
          this.routines.forEach((v, i) => v.order = i);
          this.batchReorder(this.routines);
        } catch(err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }

        el.moved.loading = true;
      },

      async reorderExercises(rt, exs) {
        rt.loading = true;

        try {
          rt.exercises = exs;
          await this.upsertRoutine(rt);
        } catch(err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }

        rt.loading = true;
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

  ::v-deep .v-expansion-panel--active > .v-expansion-panel-header,
  ::v-deep .v-expansion-panel-header { min-height: 32px; }

  ::v-deep .v-expansion-panel-content__wrap {
    padding: 0;
    padding-right: 5px;
  }
</style>
