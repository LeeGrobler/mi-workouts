<template>
  <v-form ref="form" v-model="valid">
    <heading :text="`${action === 'edit' ? 'Edit' : 'New'} Exercise`" :buttons="headingBtns" role="section" class="mb-9" />

    <v-row>
      <v-col cols="12" class="py-0"> <!-- Name -->
        <v-text-field :rules="validators.exercise" :disabled="loading" label="Name" v-model="form.name" required solo dense />
      </v-col>
    </v-row>

    <form-row :loading="loading" :clearOnClose="action !== 'edit'" label="Sets & Reps" :fields="[
      { element: 'text-field', key: 'sets', label: 'Sets', target: form.sets },
      { element: 'text-field', key: 'reps', label: 'Reps', target: form.reps },
    ]" @update="form[arguments[0]] = arguments[1]" />

    <form-row :loading="loading" :clearOnClose="action !== 'edit'" label="Type & Amount" :fields="[
      { element: 'select', key: 'unitType', label: 'Type', target: form.unitType, items: units, itemText: 'category', itemValue: 'category', change: changeUnit },
      { element: 'text-field', key: 'amount', label: 'Amount', target: form.amount },
      { element: 'select', key: 'unit', label: $data._.startCase(form.unitType), target: form.unit, items: unitTypeItems, itemText: 'name', itemValue: 'symbol' },
    ]" @update="form[arguments[0]] = arguments[1]" />

    <form-row :loading="loading" :clearOnClose="action !== 'edit'" label="Tutorial Link" :fields="[
      { element: 'text-field', key: 'link', label: 'Tutorial Link', target: form.link },
    ]" @update="form[arguments[0]] = arguments[1]" />

    <form-row :loading="loading" :clearOnClose="action !== 'edit'" label="Notes" :fields="[
      { element: 'text-area', key: 'notes', label: 'Description / Notes', target: form.notes },
    ]" @update="form[arguments[0]] = arguments[1]" />

    <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary" class="mt-3 v-step-2">{{ action === 'edit' ? 'Update' : 'Create' }}</v-btn>
    <v-btn :disabled="loading" @click="$router.from ? $router.back() : $router.push('/exercises')" type="button" color="grey lighten-1" class="mt-3 ml-2">Cancel</v-btn>
  </v-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import units from '@/config/units';
  import Heading from '@/components/Layout/Heading';
  import FormRow from '@/components/Exercise/FormRow';

  export default {
    name: 'ExerciseUpsert',

    components: { Heading, FormRow },

    data() {
      return {
        _,
        units,
        valid: false,
        loading: false,
        action: this.$route.params.action,
        form: this.defaultForm(),
        ogUnit: null, // only used when editing
        validators: {
          exercise: [
            v => !!v || 'Please enter a Name',
            v1 => {
              const ex = this.exercises?.find(v2 => v2.name === _.startCase(v1));
              return (!ex && this.action === 'create') || ((!ex || ex.id === this.form.id) && this.action === 'edit') || `${_.startCase(v1)} already exists`;
            }
          ]
        },
        headingBtns: [{
          icon: 'mdi-close',
          disabled: this.loading,
          callback: () => this.$router.from ? this.$router.back() : this.$router.push('/exercises'),
          text: 'Cancel'
        }],
      };
    },

    mounted() {
      if(this.action === 'edit') {
        if(Array.isArray(this.exercises)) {
          this.form = _.cloneDeep(this.exercises.find(v => v.id === this.$route.params.id));
          this.setOgUnit();
        } else this.$watch('exercises', function(n) {
          this.form = _.cloneDeep(n.find(v => v.id === this.$route.params.id));
          this.setOgUnit();
        });
      }

      this.$tours['tutorial'].nextStep();
    },

    computed: {
      ...mapGetters({ exercises: 'exercise/getExercises' }),

      unitTypeItems() {
        return this.units.find(v => v.category === this.form.unitType)?.items;
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
          unit: units[0]?.items[0].symbol,
          link: '',
          notes: '',
        };
      },

      setOgUnit() {
        this.ogUnit = {
          unit: this.form.unit,
          unitType: this.form.unitType,
        };
      },

      changeUnit() {
        if(this.form.unitType === this.ogUnit?.unitType) this.form.unit = this.ogUnit.unit;
        else this.form.unit = this.units.find(v => v.category === this.form.unitType)?.items[0].symbol;
      },
      
      async submit() {
        if(!this.$refs.form.validate()) return;

        try {
          this.form.name = _.startCase(this.form.name);
          this.form.unit = typeof this.form.unit === 'object' ? this.form.unit.symbol : this.form.unit;

          this.loading = true;
          const exercise = await this.upsertExercise(this.trimObject(this.form));

          this.$refs.form.resetValidation();
          this.alert({ color: 'success', timeout: 10000, text: `${this.form.name} successfully ${this.action === 'edit' ? 'updated' : 'added'}` });
          this.form = this.defaultForm();

          // if you're coming from /routines/edit|create, return to /routines/edit|create/exercise_id, else go back()
          if(exercise && new RegExp(/\/routines\/[a-z]+/g).test(this.$router.from)) {
            this.$router.push(`${this.$router.from}/${exercise}`);
          } else if(this.$router.from) this.$router.back(); // if there's a previous url, go back (i.e. you didn't open a new tab and come straight here)
          else this.$router.push('/exercises'); // otherwise go back to exercises
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