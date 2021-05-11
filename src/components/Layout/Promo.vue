<template>
  <transition name="slide-fade" mode="out-in">
    <div v-if="footer && promo" class="promo-container" :class="`${position}-bottom`" :style="styles">

      <a :href="promo.link" target="_blank">
        <img :src="promo.image" alt="Promotion" />
      </a>

    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data: () => ({
      promo: null,
    }),

    mounted() {
      if(!this.promos) this.$watch('promos', (n, o) => {
        if(Array.isArray(n) && n > 0 && !this.promo) this.setPromo();
      });

      if(!this.promo) this.setPromo();
    },
    
    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        footer: 'ui/getFooterPos',
        promos: 'general/getPromos',
      }),

      position() {
        return this.footer.top < window.innerHeight ? 'absolute' : 'fixed';
      },
    
      styles() {
        const fromBottom = this.$route.meta.workoutsBar ? 48 : 0;
        if(this.position === 'fixed') {
          return { 'bottom': `${this.online ? 0 + fromBottom : 24 + fromBottom}px` };
        } else {
          return { 'bottom': `${this.online ? this.footer.height + fromBottom : this.footer.height + 24 + fromBottom}px` };
        }
      },
    },

    methods: {
      getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      setPromo() {
        const client = this.promos[this.getRandomNumber(0, this.promos.length - 1)];
        this.promo = client.ads[this.getRandomNumber(0, client.ads.length - 1)];
      },
    },
  }
</script>

<style lang="scss" scoped>
  .promo-container {
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    padding: 5px;
    line-height: 0;

    @media only screen and (min-width: 1264px) {
      &.fixed-bottom img { margin-left: 80px; }
    }

    img {
      width: 100%;
      height: 100%;
      max-width: 424px;
    }
  }
</style>