<template>
  <v-dialog v-model="visible" :persistent="!getDialogue.closeOnShadowClick">
    <v-card>
      <v-card-title class="headline pt-3 px-3" :class="getDialogue.color ? `${getDialogue.color} white--text` : ''">
        <v-icon v-if="getDialogue.color" class="mr-3" color="white">{{ getIcon(getDialogue.color) }}</v-icon>
        {{ getDialogue.title }}
      </v-card-title>
      
      <v-card-text class="px-3" :class="{ 'pt-5' : !!getDialogue.color }" v-html="getDialogue.text"></v-card-text>

      <v-card-text v-if="!!getDialogue.confirmation">
        <v-text-field :rules="validators.required" v-model.trim="userSubmission" :label="getConfirmationLabel" outlined
          dense
        />
      </v-card-text>

      <v-card-actions class="px-3">
        <v-spacer />
        <template v-for="(action, i) in refinedActions">
          <v-btn :color="action.color" :depressed="action.flat" @click="fireAction(action.callback, action.keepOpen)" :key="i" :disabled="action.disabled">{{ action.text }}</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // this.dialogue({
  //   closeOnShadowClick: false, // optional
  //   color: 'success', // optional; success, info, warning, error
  //   title: 'Test Dialogue',
  //   text: 'Test Text', // accepts html
  //   confirmation: { // optional
  //     text: 'Enter this text', // optional; text for user to enter
  //     target: 1, // optional; button to toggle if user text matches confirmation.text
  //   },
  //   actions: [{ // optional
  //     color: 'success', // optional; any vuetify-allowed color
  //     flat: false, // optional
  //     callback: '', // optional
  //     keepOpen: false, // optional
  //     text: 'Close'
  //   }],
  // })

  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'Dialogue',

    data() {
      return {
        userSubmission: '',
        validators: {
          required: [ v => !!v || `Please enter "${this.getDialogue.confirmation?.text}" to proceed` ],
        },
      };
    },

    computed: {
      ...mapGetters({ getDialogue: 'ui/getDialogue' }),

      visible: {
        get() { return this.getDialogue.visible; },
        set() { this.hideDialogue(); },
      },

      refinedActions() {
        const target = this.getDialogue.confirmation?.target;
        const sub = this.userSubmission.toLowerCase();
        const text = this.getDialogue.confirmation?.text?.toLowerCase();

        return this.getDialogue.actions?.map((v, i) => ({
          ...v,
          disabled: i === target && sub !== text
        }));
      },

      getConfirmationLabel() {
        return `Enter "${this.getDialogue.confirmation?.text}" to proceed`;
      },
    },

    methods: {
      ...mapMutations({ hideDialogue: 'ui/hideDialogue' }),

      getIcon(color) {
        return {
          success: 'mdi-checkbox-marked-circle',
          info: 'mdi-information',
          warning: 'mdi-alert-circle',
          error: 'mdi-alert-decagram',
        }[color];
      },

      fireAction(callback, keepOpen) {
        if(callback) callback();
        if(!keepOpen) this.visible = false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .v-dialog { margin: 5px; }
</style>
