<template>
  <div class="comp-root text-center">
    <slot name="headline"></slot>

    <v-divider dark class="mt-5 mb-8" />

    <!--  as you accumulate payment methods, add them to hidden[] (all execpt the one calling hideOthers()), then you have to v-if each method and hide them if they're in hidden[] -->
    <payfast v-if="!hidden.includes('payfast')" :loading="loading === 'payfast'" @setLoading="loading = arguments[0]" @hideOthers="hidden = []" />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Payfast from '@/components/Donate/Payfast';

  export default {
    name: 'DonateForm',

    components: { Payfast },

    data: () => ({
      loading: null,
      hidden: [],
    }),

    computed: {
      ...mapGetters({}),
    },

    methods: {
      ...mapActions({}),
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>