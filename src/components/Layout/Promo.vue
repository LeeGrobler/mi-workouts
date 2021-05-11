<template>
  <transition name="slide-fade" mode="out-in">
    <div v-if="promo" class="promo-container">

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
      console.log('promos:', this.promos);

      if(!this.promos) this.$watch('promos', (n, o) => {
        if(Array.isArray(n) && n > 0) this.setPromo();
      });

      if(!this.promo) this.setPromo();
    },
    
    computed: {
      ...mapGetters({ promos: 'general/getPromos' }),
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

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>