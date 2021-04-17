import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      online: 'general/getOnline',
    }),
  },

  watch: {
    'user.isAnonymous'(n) { this.checkAnon(n); },
    user(n) { this.checkAuth(n); },
    online(n) { this.checkConnection(n); },
  },  

  methods: {
    checkAnon(anon) {
      const req = this.$route.meta.anon;
      if(req === 'N' && anon) return this.$router.push('/');
      else if(req === 'Y' && !anon) return this.$router.push('/');
    },
    checkAuth(user) {
      const req = this.$route.meta.auth;
      if(req === 'N' && !!user) return this.$router.push('/');
      else if(req === 'Y' && !user) return this.$router.push('/sign-in');
    },
    checkConnection(conn) {
      const req = this.$route.meta.online;
      if(req === 'N' && conn) return this.$router.push('/');
      else if(req === 'Y' && !conn) return this.$router.push('/');
    },
  },
};
