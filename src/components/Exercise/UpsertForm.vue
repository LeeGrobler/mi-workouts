<template>
  <v-form ref="form" v-model="valid">
    <heading text="New Exercise" role="section" />

    <v-row>
      <v-col cols="12" class="py-0">
        <v-text-field :rules="validators.required('Name')" :disabled="loading" placeholder="Name" v-model.trim="form.name" required :solo="dark" :flat="dark" :outlined="!dark" dense />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" class="py-0 pr-1">
        <v-text-field :disabled="loading" placeholder="Sets" v-model.trim="form.sets" :solo="dark" :flat="dark" :outlined="!dark" dense />
      </v-col>

      <v-col cols="6" class="py-0 pl-1">
        <v-text-field :disabled="loading" placeholder="Reps" v-model.trim="form.reps" :solo="dark" :flat="dark" :outlined="!dark" dense />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" class="py-0 pr-1">
        <v-select :disabled="loading" placeholder="Type" v-model.trim="unitType" :solo="dark" :flat="dark" :outlined="!dark" dense :items="units" item-text="category" return-object />
      </v-col>

      <v-col cols="4" class="py-0 px-1">
        <v-text-field :disabled="loading" placeholder="Amount" v-model.trim="form.amount" :solo="dark" :flat="dark" :outlined="!dark" dense />
      </v-col>

      <v-col cols="4" class="py-0 pl-1">
        <v-select :disabled="loading" :placeholder="$data._.startCase(form.unitType.category)" v-model.trim="form.unit" :solo="dark" :flat="dark" :outlined="!dark" item-value="symbol"
          dense :items="form.unitType.items" item-text="name"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0">
        <v-text-field :disabled="loading" placeholder="Tutorial Link" v-model.trim="form.link" :solo="dark" :flat="dark" :outlined="!dark" dense />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0">
        <v-textarea :disabled="loading" placeholder="Description / Notes" v-model.trim="form.notes" :solo="dark" :flat="dark" :outlined="!dark" dense rows="2" no-resize />
      </v-col>
    </v-row>

    <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary">Create</v-btn>
  </v-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import validators from '@/config/validators';
  import units from '@/config/units';
  import Heading from '@/components/Layout/Heading';

  export default {
    name: 'ExerciseUpsertForm',

    components: { Heading },

    props: {
      dark: { type: Boolean, default: true }
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
      // ...mapGetters({ getUpserting: 'exercise/getUpserting' }),

      // upserting: {
      //   get() { return this.getUpserting },
      //   set(v) { this.setUpserting(v) },
      // }

      unitType: {
        get() { return this.form.unitType; },
        set(v) {
          this.form.unitType = v;
          this.form.unit = this.form.unitType.items[0];
        }
      },
    },

    methods: {
      ...mapActions({
        setUpserting: 'exercise/setUpserting',
        upsertExercise: 'exercise/upsertExercise',
      }),

      defaultForm() {
        return {
          name: '',
          sets: '',
          reps: '',
          unitType: units[0],
          amount: '',
          unit: units[0].items[0],
          link: '',
          notes: '',
        };
      },

      async submit() {
        if(!this.$refs.form.validate()) return;
        this.loading = true;

        try {
          // TODO: use to _.pick the desired props instead of taking the whole thing (you can then also get rid of the json clone)

          const obj = JSON.parse(JSON.stringify(this.form));
          obj.name = _.startCase(obj.name);
          obj.unit = obj.unit.symbol;
          obj.unitType = obj.unitType.category;

          const exercise = await this.upsertExercise(obj);
          if(this.callback) this.callback(exercise);

          this.$refs.form.resetValidation();
          this.alert({ color: 'success', timeout: 10000, text: `${obj.name} added successfully` });
          this.form = this.defaultForm();
        } catch (err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }

        this.loading = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>