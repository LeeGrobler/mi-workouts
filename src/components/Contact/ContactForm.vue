<template>
  <v-form ref="form" v-model="valid">
    <slot></slot>
    <v-text-field :rules="validators.required('Name')" :disabled="loading" label="Name" v-model.trim="form.name" required :solo="dark" :flat="dark" :outlined="!dark" dense />
    <v-text-field :rules="validators.email" :disabled="loading" label="Email" v-model.trim="form.email" required :solo="dark" :flat="dark" :outlined="!dark" dense />
    <v-textarea :rules="validators.required('Message')" :disabled="loading" label="Message" v-model.trim="form.message" required :solo="dark" :flat="dark" :outlined="!dark" no-resize
      rows="3"
    />
    <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" type="button" color="primary">Send</v-btn>
  </v-form>
</template>

<script>
  import { mapActions } from 'vuex';
  import validators from '@/config/validators';

  export default {
    name: 'ContactForm',

    props: {
      dark: { type: Boolean, default: true }
    },

    data: () => ({
      validators,
      valid: false,
      loading: false,
      form: {
        name: '',
        email: '',
        message: '',
      }
    }),

    methods: {
      ...mapActions({ contact: 'general/contact' }),

      async submit() {
        this.loading = true;

        try {
          const token = await this.$recaptcha('contact_submit');
          const { data: { status, message } } = await this.contact({ ...this.form, token });
          this.alert({ color: status === 'success' ? 'success' : 'warning', timeout: 10000, text: message });
          this.form = { name: '', email: '', message: '' };
          this.$refs.form.resetValidation();
        } catch(err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }

        this.loading = false;        
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>