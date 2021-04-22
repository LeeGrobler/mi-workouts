export default {
  mounted() {
    this.toggleRecaptchaBadge();
  },

  methods: {
    async toggleRecaptchaBadge(show) {
      await this.$recaptchaLoaded();
      if(this.$route.meta.recaptchaBadge) {
        return this.$recaptchaInstance.showBadge();
      }
      this.$recaptchaInstance.hideBadge();
    },
  }
}
