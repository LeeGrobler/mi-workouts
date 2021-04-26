<template>
  <v-form ref="form" v-model="valid">
    <heading :text="`${!!routine ? 'Edit' : 'New'} Routine`" role="section" :buttons="[{ icon: 'mdi-close', disabled: loading, callback: () => $emit('edit'), text: 'Cancel' }]" />

    <v-row> <!-- Name -->
      <v-col cols="12" class="py-0">
        <v-text-field :rules="validators.required('Name')" :disabled="loading" label="Name" v-model.trim="name" required solo dense />
      </v-col>
    </v-row>

    <v-row> <!-- Exercises -->
      <v-col cols="12" class="py-0">
        <v-select :disabled="loading" label="Exercises" v-model="exercises" solo dense multiple chips small-chips append-outer-icon="mdi-plus" :items="getExercises" item-value="id"
          @click:append-outer="createExercise" item-text="name"
        />
      </v-col>
    </v-row>

    <v-row> <!-- Notes -->
      <v-col cols="12" class="py-0">
        <v-textarea :disabled="loading" placeholder="Description / Notes" v-model.trim="notes" solo dense rows="2" no-resize />
      </v-col>
    </v-row>

    <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary">{{ routine ? 'Update' : 'Create' }}</v-btn>
    <v-btn :disabled="loading" @click="$emit('edit')" type="button" color="grey lighten-1" class="ml-2">Cancel</v-btn>
  </v-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import validators from '@/config/validators';
  import Heading from '@/components/Layout/Heading';

  export default {
    name: 'UpsertRoutine',

    components: { Heading },

    props: {
      routine: { type: Object, required: false },
      callback: { type: Function, required: false },
    },

    data() {
      return {
        _,
        validators,
        valid: false,
        loading: false,
        form: this.defaultForm(),
      };
    },

    mounted() {
      if(this.progress) {
        this.name = this.progress.name || '';
        this.exercises = this.progress.exercises || [];
        this.notes = this.progress.notes || '';
      }
      this.storeProgress(null);
    },

    computed: {
      ...mapGetters({
        routines: 'routine/getRoutines',
        progress: 'routine/getProgress',
        getExercises: 'exercise/getExercises',
      }),

      // form props

      name: {
        get() { return this.routine?.name || this.form.name; },
        set(v) {
          const obj = this.routine || this.form;
          obj.name = v;
        }
      },

      exercises: {
        get() { return this.routine?.exercises || this.form.exercises },
        set(v) {
          const obj = this.routine || this.form;
          obj.exercises = v;
        }
      },

      notes: {
        get() { return this.routine?.notes || this.form.notes; },
        set(v) {
          const obj = this.routine || this.form;
          obj.notes = v;
        }
      },
    },

    methods: {
      ...mapActions({
        storeProgress: 'routine/storeProgress',
        upsertRoutine: 'routine/upsertRoutine',
      }),

      addExercise(id) {
        this.exercises.push(id);
      },

      defaultForm() {
        return {
          name: '',
          exercises: [],
          notes: '',
        };
      },

      createExercise() {
        this.storeProgress(this.routine || this.form);
        this.$emit('createExercise');
      },
      
      async submit() {
        if(!this.$refs.form.validate()) return;
        this.loading = true;

        try {
          let obj = this.routine || this.form;
          obj.name = _.startCase(obj.name);
          obj.favorite = !!this.routine ? obj.favorite : this.routines.length < 1;
          
          if(!this.routine) {
            obj.order = 0;
            if(this.routines?.length > 0) {
              obj.order = _.cloneDeep(this.routines).sort((a, b) => a.order < b.order ? 1 : -1)[0].order + 1;
            }
          }

          const routine = await this.upsertRoutine(obj);
          if(this.callback) this.callback(routine);

          this.$refs.form.resetValidation();
          this.alert({ color: 'success', timeout: 10000, text: `${obj.name} successfully ${!!this.routine ? 'updated' : 'added'}` });
          this.form = this.defaultForm();
          this.$emit('edit');
        } catch (err) {
          console.log('routine submit err:', err);
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }

        this.loading = false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .v-input__append-inner { display: none; }
  ::v-deep .mdi-plus::before { color: #fff; }
  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>