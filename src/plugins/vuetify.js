import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  treeshake: true,
  theme: {
    dark: false,
    options: { customProperties: true },
    themes: {
      light: {
        primary: colors.blue.darken2,
        secondary: colors.amber.darken3,
        accent: colors.grey.darken3,
        info: colors.blue.base,
        warning: colors.orange.darken1,
        error: colors.red.accent2,
        success: colors.green.base,
      }
    }
  }
});
