<template>
  <v-tour name="tutorial" :steps="tourSteps" :class="{ hidden }">
    <template slot-scope="tour">
      <transition name="slide-fade" mode="out-in">
        <v-step v-if="tour.steps[tour.currentStep]" :key="tour.currentStep" :step="tour.steps[tour.currentStep]" :previous-step="tour.previousStep" :next-step="tour.nextStep"
          :stop="tour.stop" :skip="tour.skip" :is-first="tour.isFirst" :is-last="tour.isLast" :labels="tour.labels"
        >
          <div slot="content" class="v-step__content" v-html="tour.steps[tour.currentStep].content"></div>
          <div slot="actions" class="v-step__actions">
            <v-btn text color="warning" @click="endTour">{{ tour.currentStep === 5 ? 'End' : 'Skip Tour' }}</v-btn>
            <v-spacer />
            <v-btn v-if="tour.currentStep === 0" text color="primary" to="/exercises/create">Get Started</v-btn>
            <v-btn v-if="tour.currentStep === 1" text color="primary" to="/exercises">Next</v-btn>
            <v-btn v-if="tour.currentStep === 2" text color="primary" @click="tour.nextStep">Next</v-btn>
            <v-btn v-if="tour.currentStep === 3" text color="primary" to="/routines">Next</v-btn>
            <v-btn v-if="tour.currentStep === 4" text color="primary" @click="tour.nextStep">Next</v-btn>
          </div>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'Tour',

    data: () => ({ hidden: false }),

    computed: {
      ...mapGetters({
        exercises: 'exercise/getExercises',
        routines: 'routine/getRoutines',
      }),

      tourSteps() {
        const starHtml = '<i aria-hidden="true" class="v-icon notranslate mdi mdi-star-outline theme--light"></i>';

        return [
          {
            header: { title: 'Welcome to MiWorkouts!' },
            content: 'This is your Home page and it\'s where all the Routines you create will appear. But before you can do that, start by creating your first Exercise.',
          },
          { content: 'To create an Exercise, simply fill in its name and details and then click Create.' },
          { content: 'This is your Exercise page. From here you can manage all the Exercises you create.' },
          { content: 'This is the Quick Nav Bar. It allows you to quickly switch between your Exercises, Routines and Home pages.' },
          { content: 'This is your Routine page. From here you can create Routines and add Exercises to them, as well as update, delete and favorite existing Routines.' },
          { content: `When you create Routines, remember to favorite them by tapping the ${starHtml} icon to have them show up on your Home page. The first one you create is favorited by default.` }
        ].map((v, i) => ({ ...v, target: `.v-step-${i+1}`, params: { enableScrolling: false } }));
      },
    },

    methods: {
      endTour() {
        this.$tours['tutorial'].skip();
        localStorage.setItem('tour-completed', true);
      },
      goto(path) {
        console.log('going to:', path);
        this.$router.push(path);
        this.$tours['tutorial'].nextStep();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .theme--light.v-btn--active:hover::before,
  .theme--light.v-btn--active::before { opacity: 0; }

  .hidden { visibility: hidden; }

  // .overlay {
    // height: 0px;
    // overflow: visible;
    // pointer-events: none;
    // background: none !important;
    // user-select: none;

    // position: fixed;
    // width: 100%;
    // height: 100%;
    // top: 0;
    // left: 0;
    // background: rgba(0, 0, 0, 0.7);
  // }
</style>
