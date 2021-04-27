<template>
  <div class="comp-root">
    <heading text="Danger Zone" role="section" color="error" />

    <p class="white--text">This is where you can permanently delete your MiWorkouts account and all the data you created.</p>

    <v-btn block :disabled="loading" :loading="loading" x-large color="error" dark @click="startDelete">
      <v-icon left>mdi-delete</v-icon>
      Delete Account
    </v-btn>

  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Heading from '@/components/Layout/Heading';

  export default {
    name: 'DangerZone',

    components: { Heading },

    data: () => ({
      loading: false,
    }),

    methods: {
      ...mapActions({
        delete: 'user/deleteAccount',
        logout: 'user/logout',
      }),

      startDelete() {
        this.dialogue({
          color: 'error',
          title: `Delete Exercise`,
          text: `
            <p>Although we are very sad to see you go, we hope you achieve your fitness goals in whichever way feels most comfortable to you.</p>
            <p>This will remove your user account from our systems and delete all the data you created including all your Exercises and Routines.</p>
            <p>Are you sure you want to proceed?</p>
          `,
          confirmation: {
            text: 'Delete',
            target: 1,
          },
          actions: [{ text: 'No' }, {
            color: 'error',
            callback: async () => {
              try {
                this.loading = true;
                await this.delete();
                this.alert({
                  color: 'success',
                  timeout: 10000,
                  text: 'Your account and all associated data has been successfully deleted. Once you\'re ready to give MiWorkouts another try, you\'re welcome to sign in again.',
                });
              } catch (err) {
                this.alert({ color: 'error', timeout: 10000, text: err.message });
              }
              this.loading = false;
            },
            text: 'Yes, Delete'
          }],
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  ::v-deep .theme--light.v-btn.v-btn--disabled.v-btn--has-bg,
  ::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #777777b5 !important;
  }
</style>