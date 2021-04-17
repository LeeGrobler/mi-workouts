import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

export default Vue.mixin({
  computed: {
    ...mapGetters({ pageMeta: 'ui/getMataInfo' }),    
  },

  methods: {
    ...mapMutations({
      revealAlert: 'ui/showAlert',
      revealDialogue: 'ui/showDialogue',
    }),
    alert(cfg) {
      this.revealAlert(cfg);
    },
    dialogue(cfg) {
      this.revealDialogue(cfg);
    },
  },
});
