<template>
  <v-list two-line class="py-0 v-step-3" color="transparent">

    <v-text-field v-if="showFilter" label="Filter" v-model="filter" prepend-inner-icon="mdi-magnify" solo dense hide-details clearable class="my-3" />

    <transition-group name="list">
      <v-list-group v-for="ex in filteredExercises" :key="ex.id">
        <template v-slot:activator>
          <!-- avatar -->
          <v-list-item-avatar class="my-0 mr-2">
            <v-progress-circular v-if="ex.loading" indeterminate color="primary" />
            <v-icon v-else class="secondary" dark>{{ getIcon(ex.unitType) }}</v-icon>
          </v-list-item-avatar>
          <!-- deets -->
          <v-list-item-content class="py-0">
            <v-list-item-title class="white--text">
              {{ ex.name }}
              <v-icon v-if="ex.link" x-small class="ml-1 white--text">mdi-video-outline</v-icon>
              <v-icon v-if="ex.notes" x-small class="ml-1 white--text">mdi-message-bulleted</v-icon>
            </v-list-item-title>
            <v-list-item-subtitle class="white--text">{{ getDetailsText(ex) }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <!-- card -->
        <v-list-item>
          <v-list-item-content class="py-1">
            <v-list-item-title>

              <v-card flat>
                <iframe v-if="ex.link" :src="ex.link" frameborder="0" class="tutorial-frame" allowfullscreen></iframe>

                <v-card-text class="pa-2 pb-0 subtitle-2">{{ ex.name }}</v-card-text>
                <v-card-text v-if="ex.notes" class="pa-2 pb-0">
                  <p v-if="ex.notes" class="wrap-text mb-0">{{ ex.notes }}</p>
                </v-card-text>

                <v-card-actions class="pa-2">
                  <v-spacer></v-spacer>
                  <v-btn text color="error" @click="remove(ex)">Delete</v-btn>
                  <v-btn text color="success" :to="`/exercises/edit/${ex.id}`">Edit</v-btn>
                </v-card-actions>
              </v-card>
              
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </transition-group>

  </v-list>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'ExerciseList',

    data: () => ({
      exercises: [],
      listFilter: '',
    }),

    mounted() {
      this.exercises = _.cloneDeep(this.getExercises);
      this.$tours['tutorial'].nextStep();
    },

    computed: {
      ...mapGetters({ getExercises: 'exercise/getExercises' }),

      filter: {
        get() { return this.listFilter; },
        set(v) { this.listFilter = v || ''; },
      },

      filteredExercises() {
        return this.exercises?.filter(v1 => 
          Object.keys(_.omit(v1, ['id', 'unitType', 'link'])).filter(v2 => 
            v1[v2].toString().toLowerCase().indexOf(this.filter.toLowerCase()) > -1
          ).length > 0
        );
      },

      showFilter() {
        return this.exercises?.length > 1;
      },
    },

    methods: {
      ...mapActions({
        setEdit: 'exercise/setEdit',
        delete: 'exercise/deleteExercise'
      }),

      getIcon(category) {
        switch(category) {
          case 'Weight': return 'mdi-weight-kilogram';
          case 'Time': return 'mdi-timer-outline';
          case 'Distance': return 'mdi-run-fast';
          case 'Calories': return 'mdi-fire';
        }
      },

      getDetailsText(v) { // if you want to take a stab at simplifying this mess, please be my guest
        if(v.sets && !v.reps && !v.amount) return v.sets;
        if(!v.sets && v.reps && !v.amount) return v.reps;
        if(!v.sets && !v.reps && v.amount) return `${v.amount} ${v.unit}`;
        if(v.sets && v.reps && !v.amount) return `${v.sets} x ${v.reps}`;
        if(!v.sets && v.reps && v.amount) return `${v.reps} @ ${v.amount} ${v.unit}`;
        if(v.sets && !v.reps && v.amount) return `${v.sets} @ ${v.amount} ${v.unit}`;
        if(v.sets && v.reps && v.amount) return `${v.sets} x ${v.reps} @ ${v.amount} ${v.unit}`;
      },

      remove(ex) {
        this.dialogue({
          color: 'error',
          title: `Delete Exercise`,
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
    },

    watch: {
      getExercises(n) {
        this.exercises = _.cloneDeep(n);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  ::v-deep .v-list-item {
    padding: 4px 0;
    min-height: 0;
  }

  ::v-deep .v-list-group__header__append-icon i { color: #fff; }
  ::v-deep .v-list-item__action--stack { flex-direction: unset; }
  ::v-deep .v-application--is-ltr .v-card__actions > .v-btn.v-btn + .v-btn { margin-left: 0; }

  ::v-deep .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
    margin-left: 0;
    min-width: unset;
  }

  .tutorial-frame {
    width: 100%;
    margin-bottom: -7px;
  }
</style>
