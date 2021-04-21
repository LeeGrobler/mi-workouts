export default {
  // mounted() {
  //   setTimeout(() => this.hideNav(), 250);
  // },

  methods: {
    hideNav() {
      console.log('scrolling');
      window.scroll({ top: 48,  left: 0,  behavior: 'smooth' });
    },
  }
}
