<template>
  <div class="page-root" :class="{ 'bar-padding': !online }">
    <login-now-btn />

    <v-container class="white--text">
      <v-row>
        <v-col cols="12" xs="12" md="6" offset-md="3" lg="4" offset-lg="4">
          <transition-group name="slide-fade" mode="out-in">

            <v-btn key="createRtBtn" v-if="showExerciseBtn" block color="primary" dark to="/exercises/create" class="v-step-1 mt-3">
              <v-icon left>mdi-plus</v-icon>
              Create Your First Exercise
            </v-btn>

            <v-btn key="createExBtn" v-if="showRoutineBtn" block color="primary" dark to="/routines/create" class="mt-3">
              <v-icon left>mdi-plus</v-icon>
              Create Your First Routine
            </v-btn>

            <template v-else>
              <heading key="rtListHeading" v-if="routines && routines.length > 0" text="Routines" role="section" />
              <routines key="rtList" class="mt-3" />
            </template>
    
          </transition-group>
        </v-col>
      </v-row>
    </v-container>

    <connectivity-bar />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PageActions from '@/mixins/page-actions';
  import LoginNowBtn from '@/components/Layout/LoginNowBtn';
  import Heading from '@/components/Layout/Heading';
  import Routines from '@/components/Routine/List';
  import ConnectivityBar from '@/components/Layout/ConnectivityBar';

  export default {
    name: 'HomePage',

    mixins: [PageActions],

    components: { LoginNowBtn, Heading, Routines, ConnectivityBar },

    mounted() {
      this.$route.meta.bg = '3';

      this.$watch('routines', n => {
        if(n?.length === 0 && !localStorage.getItem('tour-completed')) {
          this.$tours['tutorial'].start();
        }
      });
    },

    computed: {
      ...mapGetters({
        online: 'general/getOnline',
        routines: 'routine/getRoutines',
        exercises: 'exercise/getExercises',
      }),

      showExerciseBtn() {
        return this.routines?.length === 0 && this.exercises?.length === 0;
      },
      showRoutineBtn() {
        return this.routines?.length === 0 && this.exercises?.length > 0;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
  
  .page-root { // bg-number should always correspond to mounted()::this.$route.meta.bg
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-mobile-3.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  @media only screen and (min-width: 960px) {
    .page-root { // bg-number should always correspond to mounted()::this.$route.meta.bg
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../assets/image/bg-desktop-3.jpg') no-repeat center center fixed;
      background-size: cover;
    }
  }
</style>
