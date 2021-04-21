<template>
  <v-container class="white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4" class="py-0">
        <v-list two-line class="py-0" color="transparent">
          <template v-for="ex in exercises">
            
            <v-list-group :key="ex.id">
              <template v-slot:activator>
                <!-- avatar -->
                <v-list-item-avatar class="my-0 mr-2">
                  <v-progress-circular v-if="ex.loading" indeterminate color="primary" />
                  <v-icon v-else class="secondary" dark>{{ getIcon(ex.unitType) }}</v-icon>
                </v-list-item-avatar>
                <!-- deets -->
                <v-list-item-content class="py-3">
                  <v-list-item-title class="white--text">{{ ex.name }}</v-list-item-title>
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
                        <v-btn text color="success" @click="$emit('edit', ex)">Edit</v-btn>
                      </v-card-actions>
                    </v-card>
                    
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'ListExercises',

    data: () => ({
      exercises: [],
    }),

    mounted() {
      this.exercises = _.cloneDeep(this.getExercises);
    },

    computed: {
      ...mapGetters({ getExercises: 'exercise/getExercises' }),
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
      getExercises(n) {
        if(!!n?.length) this.exercises = _.cloneDeep(n);
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .v-list-item { padding: 0 8px; }
  ::v-deep .v-list-group__header__append-icon i { color: #fff; }
  ::v-deep .v-list-item__action--stack { flex-direction: unset; }
  ::v-deep .v-list--two-line .v-list-item, .v-list-item--two-line { min-height: unset; }
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
