<template>
  <div class="expand-panels mt-3">
    <draggable v-model="filteredRoutines" handle=".drag-icon" @change="reorder">
      <div class="expand-panel" v-for="rt in filteredRoutines" :key="rt.id" :class="{ 'active': rt.expanded }">
        <div class="panel-head" @click="rt.exercises.length > 0 ? toggleExpanded(rt) : null">
          <div>
            <v-icon class="drag-icon" color="white">mdi-drag-vertical</v-icon>
            {{ rt.name }}
          </div>

          <div>
            <v-btn x-small icon @click.stop="favorite(rt)">
              <v-icon :color="rt.favorite ? '#FFD700' : '#fff'">{{ rt.favorite ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            </v-btn>
            <v-btn x-small icon @click.stop="remove(rt)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
            <v-btn x-small icon @click.stop="$emit('edit', rt)">
              <v-icon color="success">mdi-pencil</v-icon>
            </v-btn>
            <v-btn x-small icon>
              <v-icon :color="rt.exercises.length > 0 ? '#fff' : '#333'" class="expand-caret">mdi-chevron-down</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="panel-body">
          <v-card color="transparent">
            <v-card-text v-if="rt.notes" class="pt-1 pb-0 white--text">{{ rt.notes }}</v-card-text>
            <exercise-list :list-exercises="getExercisesFromId(rt.exercises)" @reorderExercises="reorderExercises(rt, arguments[0])" />
          </v-card>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { mapGetters, mapActions } from 'vuex';
  import ExerciseList from '@/components/Routine/ExerciseList';

  export default {
    name: 'ListRoutines',

    components: { Draggable, ExerciseList },

    props: {
      favesOnly: { type: Boolean, required: false, default: false }
    },

    data: () => ({ routines: [] }),

    mounted() {
      this.routines = _.cloneDeep(this.getRoutines);
      if(this.favesOnly) this.routines?.map(v => v.expanded = v.exercises.length > 0 ? !v.expanded : false);
    },

    computed: {
      ...mapGetters({
        exercises: 'exercise/getExercises',
        getRoutines: 'routine/getRoutines',
      }),
      
      filteredRoutines: {
        get() {
          if(!this.favesOnly) return this.routines;
          return this.routines?.filter(v => v.favorite);
        },
        set(v) { this.routines = v; },
      },
    },

    methods: {
      ...mapActions({
        delete: 'routine/deleteRoutine',
        batchReorder: 'routine/batchReorder',
        upsertRoutine: 'routine/upsertRoutine',
      }),

      toggleExpanded(rt) {
        if(!rt.expanded) this.routines.forEach(v => v.expanded = false);
        rt.expanded = !rt.expanded;
      },

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

  .expand-panels .expand-panel {
    .panel-head {
      height: 32px;
      display: flex;
      justify-content: space-between;
    }

    .panel-body {
      height: 0;
      overflow: hidden;
      transition: padding .2s ease, opacity .2s ease;
      padding: 0 .5rem;
      opacity: 0;
    }

    .panel-body::before, .panel-body::after {
      content: "";
      display: block;
    }

    .panel-body::before { margin-top: -2.8rem; }
    .panel-body::after { margin-bottom: -2.2rem; }

    .expand-caret { font-size: 24px !important; }

    &.active {
      .panel-body {
        height: auto;
        opacity: 1;
        padding: 2.5rem .5rem;
      }

      .expand-caret { transform: rotate(-180deg); }
    }
  }
</style>
