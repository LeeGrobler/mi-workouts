export default {
  mounted() {
    setTimeout(() => this.hideNav(), 250);
  },

  methods: {
    hideNav() {
      window.scroll({ top: 48,  left: 0,  behavior: 'smooth' });
      // document.getElementsByClassName('app-root')[0].scroll({ top: 48,  left: 0,  behavior: 'smooth' });
    },
  }
}

// import { mapActions } from 'vuex';

// export default {
//   methods: {
//     ...mapActions({
//       validateRecaptcha: 'general/validateRecaptcha',
//       showRecaptcha: 'ui/showRecaptcha',
//       hideRecaptcha: 'ui/hideRecaptcha',
//     }),

//     async pageRecaptcha(page) {
//       try {
//         await this.$recaptchaLoaded();
//         const token = await this.$recaptcha(page);
//         await this.validateRecaptcha(token);
//       } catch (err) {
//         if(process.env.NODE_ENV === 'development') {
//           console.log('pageRecaptcha err:', err);
//           this.alert({ color: 'error', timeout: 10000, text: err.message });
//         }
//       }
//     },
//   },  
// };
