<template>
  <v-container class="upsert-root white--text">
    <v-row>
      <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">

        <v-btn v-if="!upserting" block color="primary" dark @click="upserting = !upserting">
          <v-icon left>mdi-plus</v-icon>
          Create Exercise
        </v-btn>

        <upsert-form v-else/>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import UpsertForm from '@/components/Exercise/UpsertForm';

  export default {
    name: 'UpsertExercise',

    components: { UpsertForm },

    computed: {
      ...mapGetters({ getUpserting: 'exercise/getUpserting' }),

      upserting: {
        get() { return this.getUpserting },
        set(v) { this.setUpserting(v) },
      }
    },

    methods: {
      ...mapActions({ setUpserting: 'exercise/setUpserting' }),
    }
  }
</script>

<style lang="scss" scoped>

</style>