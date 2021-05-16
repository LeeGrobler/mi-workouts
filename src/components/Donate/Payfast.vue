<template>
  <transition name="slide-fade" mode="out-in">
    <v-btn v-if="!started" block :disabled="loading" :loading="loading" x-large class="my-2" @click="start">
      <img src="@/assets/image/visa.svg" alt="mastercard" class="img-icon mr-1" />
      <img src="@/assets/image/mastercard.svg" alt="mastercard" class="img-icon mr-2" />
      Credit Card
    </v-btn>

    <v-form v-else ref="form" v-model="valid" class="text-left">
      <p class="white--text mb-2">Please select an amount to donate</p>

      <v-radio-group v-model="form.amount" dark row class="my-0">
        <v-radio v-for="v in [25, 50, 100]" :key="v" :label="`R ${formatCurrency(v)}`" :value="v" class="my-1" />
        <v-radio label="Other" value="Other" class="my-1" />
      </v-radio-group>

      <v-text-field v-if="form.amount === 'Other'" :rules="validators.amount" :disabled="loading" label="Amount" v-model.trim="formattedOther" solo @focus="setOtherCursor" ref="otherTxt"
        dense
      />

      <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary">Proceed</v-btn>
      <v-btn :disabled="loading" @click="cancel" type="button" color="grey lighten-1" class="ml-2">Cancel</v-btn>
    </v-form>
  </transition>
</template>

<script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'PayfastBtn',

    props: {
      loading: { type: Boolean, required: false }
    },

    data: () => ({
      validators: {
        amount: [
          v => !!v || v === 0 || 'Please enter an Amount.',
          v => !isNaN(v.split(',').join('')) || 'Invalid Amount.'
        ]
      },
      started: false,
      valid: false,
      form: {
        amount: 50,
        other: 0
      }
    }),

    computed: {
      formattedOther: {
        get() { return this.formatCurrency(this.form.other); },
        set(v) { this.form.other = v; },
      },
    },

    methods: {
      ...mapActions({ submitPayfastDonation: 'general/submitPayfastDonation' }),

      start() {
        this.$emit('hideOthers');
        this.started = true;
      },

      cancel() {
        this.$emit('showOthers');
        this.started = false;
      },

      setOtherCursor() {
        this.$refs.otherTxt.$el.querySelector('input').setSelectionRange(0, this.form.other.toString().split('.')[0].length);
      },

      formatCurrency(no) {
        no = no.toString().split(',').join('');
        if(isNaN(no)) return no;
        return Number(no).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },

      async submit() {
        const amount = this.form.amount === 'Other' ? Number(this.form.other) : this.form.amount;
        
        try {
          if(isNaN(amount)) return this.alert({ color: 'warning', timeout: 10000, text: 'Invalid amount' });
          this.$emit('setLoading', 'payfast');
          await this.submitPayfastDonation({ amount });
          this.$emit('setLoading', null);
        } catch (err) {
          this.$emit('setLoading', null);
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  // ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  // ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  //   background-color: #777777b5 !important;
  // }

  .img-icon { width: 24px; }
</style>