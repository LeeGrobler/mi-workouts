<template>
  <v-form ref="form" v-model="valid">
    <heading :text="`${action === 'edit' ? 'Edit' : 'New'} Exercise`" :buttons="headingBtns" role="section" class="mb-9" />

    <v-row>
      <v-col cols="12" class="py-0"> <!-- Name -->
        <v-text-field :rules="validators.required('Name')" :disabled="loading" label="Name" v-model.trim="form.name" required solo dense />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" class="py-0 pr-1"> <!-- Sets -->
        <v-text-field :disabled="loading" label="Sets" v-model.trim="form.sets" solo dense />
      </v-col>

      <v-col cols="6" class="py-0 pl-1"> <!-- Reps -->
        <v-text-field :disabled="loading" label="Reps" v-model.trim="form.reps" solo dense />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" class="py-0 pr-1"> <!-- Type -->
        <v-select :disabled="loading" label="Type" v-model="form.unitType" solo dense :items="units" item-text="category" item-value="category" />
      </v-col>

      <v-col cols="4" class="py-0 px-1"> <!-- Amount -->
        <v-text-field :disabled="loading" label="Amount" v-model.trim="form.amount" solo dense />
      </v-col>

      <v-col cols="4" class="py-0 pl-1"> <!-- Unit -->
        <v-select :disabled="loading" :label="$data._.startCase(form.unitType)" v-model="form.unit" solo item-value="symbol" :items="unitTypeItems" dense
          item-text="name"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0"> <!-- Tutorial Link -->
        <v-text-field :disabled="loading" label="Tutorial Link" v-model.trim="form.link" solo dense />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0"> <!-- Description / Notes -->
        <v-textarea :disabled="loading" placeholder="Description / Notes" v-model.trim="form.notes" solo dense rows="2" no-resize />
      </v-col>
    </v-row>

    <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary" class="v-step-2">
      {{ action === 'edit' ? 'Update' : 'Create' }}
    </v-btn>
    <v-btn :disabled="loading" @click="$router.back()" type="button" color="grey lighten-1" class="ml-2">Cancel</v-btn>
  </v-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import validators from '@/config/validators';
  import units from '@/config/units';
  import Heading from '@/components/Layout/Heading';

  export default {
    name: 'ExerciseUpsert',

    components: { Heading },

    data() {
      return {
        _,
        validators,
        units,
        valid: false,
        loading: false,
        action: this.$route.params.action,
        form: this.defaultForm(),
        headingBtns: [{
          icon: 'mdi-close',
          disabled: this.loading,
          callback: () => this.$router.back(),
          text: 'Cancel'
        }],
      };
    },

    mounted() {
      if(this.action === 'edit') {
        if(Array.isArray(this.exercises)) {
          this.form = _.cloneDeep(this.exercises.find(v => v.id === this.$route.params.id));
        } else this.$watch('exercises', function(n) {
          this.form = _.cloneDeep(n.find(v => v.id === this.$route.params.id));
        });
      }

      this.$tours['tutorial'].nextStep();
    },

    computed: {
      ...mapGetters({ exercises: 'exercise/getExercises' }),

      unitTypeItems() {
        return this.units.find(v => v.category === this.form.unitType).items;
      },
    },

    methods: {
      ...mapActions({ upsertExercise: 'exercise/upsertExercise' }),

      defaultForm() {
        return {
          name: '',
          sets: '',
          reps: '',
          unitType: units[0].category,
          amount: '',
          unit: units[0].items[0],
          link: '',
          notes: '',
        };
      },
      
      async submit() {
        if(!this.$refs.form.validate()) return;

        try {
          this.form.name = _.startCase(this.form.name);
          this.form.unit = typeof this.form.unit === 'object' ? this.form.unit.symbol : this.form.unit;

          this.loading = true;
          const exercise = await this.upsertExercise(this.form);

          this.$refs.form.resetValidation();
          this.alert({ color: 'success', timeout: 10000, text: `${this.form.name} successfully ${this.action === 'edit' ? 'updated' : 'added'}` });
          this.form = this.defaultForm();

          // if you're coming from /routines/edit|create, return to /routines/edit|create/exercise_id, else go back()
          if(exercise && new RegExp(/\/routines\/[a-z]+/g).test(this.$router.from)) {
            this.$router.push(`${this.$router.from}/${exercise}`);
          } else this.$router.back();
        } catch (err) {
          console.log('exercise submit err:', err);
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
  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>