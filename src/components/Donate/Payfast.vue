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
        <v-radio v-for="v in [20, 50, 100]" :key="v" :label="`R ${formatCurrency(v)}`" :value="v" class="my-1" />
        <v-radio label="Other" value="Other" class="my-1" />
      </v-radio-group>

      <v-text-field v-if="form.amount === 'Other'" :rules="validators.amount" :disabled="loading" label="Amount" v-model.trim="formattedOther" dense @focus="setOtherCursor" solo
        ref="otherTxt"
      />

      <!-- Pay Now button - don't remove this yet -->
      <!-- <v-btn v-if="!isNaN(paymentAmount)" :loading="loading" :disabled="!valid || loading" type="button" :href="`https://www.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=11190328&amp;item_name=donation&amp;item_description=miworkouts+donation&amp;amount=${paymentAmount}&amp;return_url=https%3A%2F%2Fmi-workouts.com%2Fpayment-complete&amp;cancel_url=https%3A%2F%2Fmi-workouts.com%2Fpayment-complete`">
        Pay Now
      </v-btn> -->

      <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button">Proceed</v-btn>
    </v-form>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  
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
      started: true,
      valid: false,
      form: {
        amount: 50,
        other: 0
      }
    }),

    computed: {
      ...mapGetters({ user: 'user/getUser' }),

      formattedOther: {
        get() { return this.formatCurrency(this.form.other); },
        set(v) { this.form.other = v; },
      },

      paymentAmount() {
        return this.form.amount === 'Other' ? Number(this.form.other) : this.form.amount;        
      },
    },

    methods: {
      ...mapActions({ generatePayment: 'general/generatePayment' }),

      start() {
        this.$emit('hideOthers');
        this.started = true;
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

          const paymentData = {
            merchant_id: process.env.VUE_APP_PAYFAST_MERCHANT_ID,
            merchant_key: process.env.VUE_APP_PAYFAST_MERCHANT_KEY,
            return_url: `${process.env.VUE_APP_BASE_URL}/payment-complete`,
            cancel_url: `${process.env.VUE_APP_BASE_URL}`,
            notify_url: process.env.VUE_APP_PAYFAST_PROCESS_PAYMENT_URL,

            name_first: this.user?.displayName?.split(' ')[0] || null,
            name_last: this.user?.displayName?.split(' ')[1] || null,
            email_address: this.user?.email || null,

            m_payment_id: null,
            amount: amount.toString(),
            item_name: 'MiWorkouts Donation',
          }

          const token = await this.$recaptcha('generate_payment');
          const payment = await this.generatePayment({ ...paymentData, token });

          paymentData.m_payment_id = payment.response?.m_payment_id;
          paymentData.signature = payment.response?.hash;
          paymentData.return_url += `?id=${payment.response?.m_payment_id}`;

          const form = document.createElement('form');
          form.method = 'POST';
          form.action = `${process.env.VUE_APP_PAYFAST_URL}/eng/process`;

          Object.keys(paymentData).forEach(v => {
            const input = document.createElement('input');
            input.name = v;
            input.value = paymentData[v];
            input.type = 'hidden';

            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);

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