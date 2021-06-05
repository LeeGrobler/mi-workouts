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

    trimObject(obj) {
      return Object.keys(obj).reduce((s, v) => {
        s[v] = typeof obj[v] === 'string' ? obj[v].trim() : obj[v];
        return s;
      }, {});
    },
  },
});
