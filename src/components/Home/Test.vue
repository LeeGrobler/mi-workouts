<template>
  <div class="comp-root">

    <v-avatar v-if="!!user" size="60px" style="position: absolute; top: 10px; right: 10px;" color="red">
      <img v-if="!!user.photoURL" alt="Avatar" :src="user.photoURL" />
      <span v-else class="white--text headline">A</span>
    </v-avatar>

    <v-btn v-if="!!user" @click="submit" class="my-5">Another!</v-btn>
    <br />
    <v-btn @click="fetchTests" class="my-5">Fetch</v-btn>
    <br />
    <v-btn @click="testAlert" class="my-5">Alert</v-btn>

    <br />
    <router-link v-if="!!user && user.isAnonymous && online" to="/sign-in">Sign In</router-link>
    <br />
    <router-link v-if="!!user && !user.isAnonymous && online" to="/logout">Logout</router-link>

    <ul class="my-5">
      <li v-for="item in tests" :key="item.id">{{ item.number }} | {{ item.id }}</li>
    </ul>

    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos debitis odit ullam? Voluptate molestias, earum adipisci, cum officiis non repellat, corrupti dolorem quisquam obcaecati suscipit velit culpa? Nostrum, veniam numquam!</p>
    
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Test',

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        user: 'user/getUser',
        tests: 'test/getTests',
      }),
    },

    methods: {
      ...mapActions({
        fetchUserTests: 'test/fetchUserTests',
        updateTests: 'test/updateTestsOwner',
        create: 'test/createTest',
      }),

      fetchTests() {
        try {
          // // this.fetchUserTests('14eamsOkiFRt60zjQL7wUW3EiTu2');
          // this.fetchUserTests('sSf3M0CK9CgENYDXkW5HEkm32873');

          const tests = [
            // {
            //   id: 'lEksRpQg47seZZIa7so6',
            //   user: 'sSf3M0CK9CgENYDXkW5HEkm32873',
            // },
            {
              id: 'cLFDV49p8fhzlrMrqtWK',
              user: '14eamsOkiFRt60zjQL7wUW3EiTu2',
            }
          ];

          this.updateTests({ tests, user: 'sSf3M0CK9CgENYDXkW5HEkm32873' })
        } catch (err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }
      },

      testAlert() {
        this.alert({
          color: 'error',
          timeout: 3000,
          text: 'Test alert',
          onClose: () => {
            console.log('alert closed');
          },
          // buttons: [{ text: 'Cancel' }, {
          //   text: 'Proceed',
          //   callback: () => console.log('proceeding'),
          // }]
        });
      },

      async submit() {
        const d = new Date();
        const number = `${this.addZeros(d.getHours())}${this.addZeros(d.getMinutes())}${this.addZeros(d.getSeconds())}`;
        try {
          this.create({ number });
        } catch (err) {
          this.alert({ color: 'error', timeout: 10000, text: err.message });
        }
      },

      addZeros(v) {
        return parseInt(v) < 10 ? `0${v}` : v.toString();
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
