<template>
  <v-form ref="form" v-model="valid">
    <heading :text="`${action === 'edit' ? 'Edit' : 'New'} Routine`" :buttons="headingBtns" role="section" class="mb-9" />

    <v-row> <!-- Name -->
      <v-col cols="12" class="py-0">
        <v-text-field :rules="validators.required('Name')" :disabled="loading" label="Name" v-model="form.name" required solo dense />
      </v-col>
    </v-row>

    <v-row> <!-- Exercises -->
      <v-col cols="12" class="py-0">
        <v-select :disabled="loading" label="Exercises" v-model="form.exercises" solo dense multiple chips small-chips :append-outer-icon="action === 'create' ? 'mdi-plus' : ''"
          :items="getExercises" item-value="id" @click:append-outer="createExercise" item-text="name"
        />
      </v-col>
    </v-row>

    <v-row> <!-- Notes -->
      <v-col cols="12" class="py-0">
        <v-textarea :disabled="loading" placeholder="Description / Notes" v-model="form.notes" solo dense rows="2" no-resize />
      </v-col>
    </v-row>

    <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary">{{ action === 'edit' ? 'Update' : 'Create' }}</v-btn>
    <v-btn :disabled="loading" @click="$router.back()" type="button" color="grey lighten-1" class="ml-2">Cancel</v-btn>
  </v-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import validators from '@/config/validators';
  import Heading from '@/components/Layout/Heading';

  export default {
    name: 'RoutineUpsert',

    components: { Heading },

    data() {
      return {
        _,
        validators,
        valid: false,
        loading: false,
        action: this.$route.params.action,
        form: this.defaultForm(),
        headingBtns: [{
          icon: 'mdi-close',
          disabled: this.loading,
          callback: () => this.$router.back(),
          text: 'Cancel'
        }]
      };
    },

    mounted() {
      const id = this.$route.params.id;

      if(this.action === 'edit') {
        if(Array.isArray(this.routines)) {
          this.form = _.cloneDeep(this.routines.find(v => v.id === id));
        } else this.$watch('routines', function(n) {
          this.form = _.cloneDeep(n.find(v => v.id === id));
        });
      }

      if(this.progress) this.form = _.cloneDeep(this.progress);
      if(this.action === 'create' && id) this.form.exercises.push(id);
      this.storeProgress(null);
    },

    computed: {
      ...mapGetters({
        routines: 'routine/getRoutines',
        progress: 'routine/getProgress',
        getExercises: 'exercise/getExercises',
      }),
    },

    methods: {
      ...mapActions({
        upsertRoutine: 'routine/upsertRoutine',
        storeProgress: 'routine/storeProgress',
      }),

      defaultForm() {
        return {
          name: '',
          exercises: [],
          notes: '',
        };
      },

      createExercise() {
        this.storeProgress(this.form);
        return this.$router.push('/exercises/create');
      },
      
      async submit() {
        if(!this.$refs.form.validate()) return;
        this.loading = true;

        try {
          this.form.name = _.startCase(this.form.name);
          this.form.favorite = this.action === 'edit' ? this.form.favorite : this.routines.length < 1;
          
          if(this.action === 'create') {
            this.form.order = 0;
            if(this.routines?.length > 0) {
              this.form.order = _.cloneDeep(this.routines).sort((a, b) => a.order < b.order ? 1 : -1)[0].order + 1;
            }
          }

          await this.upsertRoutine(this.trimObject(this.form));
          this.$refs.form.resetValidation();
          this.alert({ color: 'success', timeout: 10000, text: `${this.form.name} successfully ${this.action === 'edit' ? 'updated' : 'added'}` });
          this.form = this.defaultForm();

          // if you're coming from /exercises/edit|create, return to /routines, else go back()
          if(new RegExp(/\/exercises\/[a-z]+/g).test(this.$router.from)) {
            this.$router.push(`/routines`);
          } else this.$router.back();
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
  @import "@/assets/scss/global.scss";

  ::v-deep .v-input__append-inner { display: none; }
  ::v-deep .mdi-plus::before { color: #fff; }
  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>