<template>
  <v-list two-line class="py-0" color="transparent">

    <draggable v-model="exercises" handle=".ex-drag-icon" @change="$emit('reorderExercises', exercises.map(v => v.id))">
      <transition-group name="list">
        <v-list-group v-for="ex in exercises" :key="ex.id">
          <template v-slot:activator>
            <!-- avatar -->
            <v-list-item-avatar v-if="exercises.length > 1" class="ma-0">
              <v-icon class="ex-drag-icon" color="white">mdi-drag-vertical</v-icon>
            </v-list-item-avatar>
            <!-- deets -->
            <v-list-item-content class="py-0" :class="{ 'ml-2': exercises.length === 1 }">
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
                    <v-btn text color="success" @click="edit(ex.id)">Edit</v-btn>
                  </v-card-actions>
                </v-card>
                
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </transition-group>
    </draggable>

  </v-list>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { mapActions } from 'vuex';

  export default {
    name: 'RoutineExerciseList',

    components: { Draggable },

    props: {
      listExercises: { type: Array, required: false },
    },

    data: () => ({
      exercises: [],
    }),

    mounted() {
      this.exercises = this.listExercises;
    },

    methods: {
      ...mapActions({
        setEdit: 'exercise/setEdit',
        delete: 'exercise/deleteExercise',
      }),

      edit(id) {
        return this.$router.push(`/exercises/edit/${id}`);
      },

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
      listExercises(n) {
        this.exercises = n;
      },
    },
  }
</script>

<style lang="scss">
  .v-sheet.v-card:not(.v-sheet--outlined) { box-shadow: unset; }
</style>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  ::v-deep .v-list-item {
    padding: 4px 0 !important;
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
