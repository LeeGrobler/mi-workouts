<template>
  <v-snackbar v-model="alertInterface" :color="getAlert.color || 'accent'" :timeout="getAlert.timeout" right :vertical="!!getAlert.buttons && getAlert.buttons.length > 0" bottom>
    <v-icon color="#fff" class="pr-3">{{ getIcon(getAlert.color) || 'mdi-information' }}</v-icon>
    <span v-html="getAlert.text"></span>

    <template v-slot:action="{ attrs }">
      <template v-if="!!getAlert.buttons && getAlert.buttons.length > 0">
        <v-btn v-for="(btn, i) in getAlert.buttons" :key="i" text v-bind="attrs" @click="handleCallback(btn.callback)">{{ btn.text }}</v-btn>
      </template>
      <v-icon v-else small @click="hideAlert()" v-bind="attrs">mdi-close</v-icon>
    </template>
  </v-snackbar>
</template>

<script>
  // to add buttons to the alert, add the following array to the alert object (via show alert)
  // buttons: [{ text: 'No', }, {
  //   text: 'Yes',
  //   callback: () => console.log('You accepted. Great!'),
  // }]

  import { mapGetters } from 'vuex';
  import { mapMutations } from 'vuex';

  export default {
    name: 'Alert',

    data: () => ({ handleOnClose: true }),

    computed: {
      ...mapGetters({ getAlert: 'ui/getAlert' }),

      alertInterface: {
        get() { return this.getAlert.visible; },
        set() { this.hideAlert(); },
      },
    },

    methods: {
      ...mapMutations({
        setAlert: 'ui/setAlert',
        hideAlert: 'ui/hideAlert',
      }),
      getIcon(color) {
        return {
          'success': 'mdi-checkbox-marked-circle',
          'info': 'mdi-information',
          'warning': 'mdi-alert-circle',
          'error': 'mdi-alert-decagram',
        }[color];
      },
      handleCallback(callback) {
        this.handleOnClose = false;
        if(callback) callback();
        this.hideAlert();
      }
    },

    watch: {
      getAlert(n, o) {
        if(!n.visible && o.onClose && this.handleOnClose) o.onClose();
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
  
  ::v-deep .v-snack__wrapper { min-width: 304px; }
  ::v-deep .v-snack__content { display: flex; }

  ::v-deep .v-snack__action  {
    margin-top: -15px;
    margin-bottom: 0px !important;
  }
</style>
