<template>
  <div>
    <v-row class="my-0" @click="showFields = !showFields">
      <v-col cols="12" class="py-0 pr-1"> <!-- Heading -->
        <heading :text="label" :buttons="headingBtns" role="subtitle" class="my-0" />
      </v-col>
    </v-row>

    <transition name="slide-fade" mode="out-in">
      <v-row v-if="showFields" class="my-2">
        <v-col v-for="v in fields" :key="v.key" :cols="fields.length / 12" class="py-0 pr-1">

          <v-text-field v-if="v.element === 'text-field'" :disabled="loading" :label="v.label" :value="v.target" @input="$emit('update', v.key, arguments[0])" solo dense hide-details />

          <v-select v-else-if="v.element === 'select'" :disabled="loading" :label="v.label" :value="v.target" @input="$emit('update', v.key, arguments[0])" solo dense hide-details
            :items="v.items" :item-text="v.itemText" :item-value="v.itemValue" @change="!!v.change && v.change()"
          />

          <v-textarea v-else-if="v.element === 'text-area'" :disabled="loading" :placeholder="v.label" :value="v.target" @input="$emit('update', v.key, arguments[0])" solo dense hide-details rows="2" no-resize />

        </v-col>
      </v-row>
    </transition>
  </div>
</template>

<script>
  import Heading from '@/components/Layout/Heading';

  export default {
    components: { Heading },

    props: {
      loading: { type: Boolean, required: true },
      clearOnClose: { type: Boolean, required: false, default: false },
      label: { type: String, required: true },
      fields: { type: Array, required: true },
    },

    data() {
      return {
        showFields: false,
        headingBtns: [{
          disabled: this.loading,
          icon: 'mdi-plus',
          text: 'Add',
        }],
      };
    },

    watch: {
      showFields(n) {
        this.headingBtns[0].icon = n ? 'mdi-minus' : 'mdi-plus';
        this.headingBtns[0].text = n ? 'Remove' : 'Add';
        !n && this.clearOnClose && this.fields.filter(v => v.element !== 'select').forEach(v => this.$emit('update', v.key, ''));
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";
</style>
