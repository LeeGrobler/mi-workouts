<template>
  <v-container class="upsert-root white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">

        <v-btn v-if="!upserting" block color="primary" dark @click="upserting = !upserting">
          <v-icon left>mdi-plus</v-icon>
          Create Exercise
        </v-btn>

        <v-form v-else ref="form" v-model="valid">
          <heading :text="`${!!exercise ? 'Edit' : 'New'} Exercise`" role="section" :buttons="[{ icon: 'mdi-close', disabled: loading, callback: () => $emit('edit'), text: 'Cancel' }]" />

          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field :rules="validators.required('Name')" :disabled="loading" placeholder="Name" v-model.trim="name" required solo dense />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="py-0 pr-1">
              <v-text-field :disabled="loading" placeholder="Sets" v-model.trim="sets" solo dense />
            </v-col>

            <v-col cols="6" class="py-0 pl-1">
              <v-text-field :disabled="loading" placeholder="Reps" v-model.trim="reps" solo dense />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4" class="py-0 pr-1">
              <v-select :disabled="loading" placeholder="Type" v-model="unitType" solo dense :items="units" item-text="category" item-value="category" />
            </v-col>

            <v-col cols="4" class="py-0 px-1">
              <v-text-field :disabled="loading" placeholder="Amount" v-model.trim="amount" solo dense />
            </v-col>

            <v-col cols="4" class="py-0 pl-1">
              <v-select :disabled="loading" :placeholder="$data._.startCase(unitType)" v-model="unit" solo item-value="symbol" :items="unitTypeItems" dense
                item-text="name"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field :disabled="loading" placeholder="Tutorial Link" v-model.trim="link" solo dense />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="py-0">
              <v-textarea :disabled="loading" placeholder="Description / Notes" v-model.trim="notes" solo dense rows="2" no-resize />
            </v-col>
          </v-row>

          <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary">{{ exercise ? 'Update' : 'Create' }}</v-btn>
          <v-btn :disabled="loading" @click="$emit('edit')" type="button" color="grey lighten-1" class="ml-2">Cancel</v-btn>
        </v-form>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  import validators from '@/config/validators';
  import units from '@/config/units';
  import Heading from '@/components/Layout/Heading';

  export default {
    name: 'UpsertExercise',

    components: { Heading },

    props: {
      getUpserting: { type: Boolean, required: false },
      exercise: { type: Object, required: false },
    },

    data() {
      return {
        _,
        validators,
        units,
        valid: false,
        loading: false,
        form: this.defaultForm(),
      };
    },

    computed: {
      upserting: {
        get() { return this.getUpserting },
        set(v) { this.$emit('setUpserting', v) },
      },

      unitTypeItems() {
        return this.units.find(v => v.category === this.unitType).items;
      },

      // form props

      name: {
        get() { return this.exercise?.name || this.form.name; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.name = v;
        }
      },

      sets: {
        get() { return this.exercise?.sets || this.form.sets; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.sets = v;
        }
      },

      reps: {
        get() { return this.exercise?.reps || this.form.reps; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.reps = v;
        }
      },

      unitType: {
        get() { return this.exercise?.unitType || this.form.unitType; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.unitType = v;
          obj.unit = this.units.find(v2 => v2.category === v).items[0];
        }
      },

      amount: {
        get() { return this.exercise?.amount || this.form.amount; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.amount = v;
        }
      },

      unit: {
        get() { return this.exercise?.unit || this.form.unit; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.unit = v;
        }
      },

      link: {
        get() { return this.exercise?.link || this.form.link; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.link = v;
        }
      },

      notes: {
        get() { return this.exercise?.notes || this.form.notes; },
        set(v) {
          const obj = this.exercise || this.form;
          obj.notes = v;
        }
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
          let obj = this.exercise || this.form;
          obj = _.pick(obj, ['id', 'name', 'sets', 'reps', 'unitType', 'amount', 'unit', 'link', 'notes']);
          obj.name = _.startCase(obj.name);
          obj.unit = typeof obj.unit === 'object' ? obj.unit.symbol : obj.unit;

          this.loading = true;
          const exercise = await this.upsertExercise(obj);
          if(this.callback) this.callback(exercise);

          this.$refs.form.resetValidation();
          this.alert({ color: 'success', timeout: 10000, text: `${obj.name} successfully ${!!this.exercise ? 'updated' : 'added'}` });
          this.form = this.defaultForm();
          this.upserting = false;
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
  ::v-deep .v-input__append-inner { display: none; }
  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>