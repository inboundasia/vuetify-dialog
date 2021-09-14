import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
import DialogManager from './DialogManager'
import AppDialog from './AppDialog'

Vue.use(Vuetify)

// Reference: https://github.com/euvl/vue-js-modal/blob/master/src/Plugin.js
const Plugin = {
  install(Vue, options = {}) {
    if (Vue.prototype.$dialog) {
      return
    }

    const Manager = new DialogManager()

    Object.defineProperty(Vue.prototype, '$dialog', {
      get: function () {
        const caller = this

        if (caller instanceof Vue) {
          const root = caller.$root

          if (!Manager.root) {
            Manager.setDynamicModalContainer(root)
          }
        }

        return Manager
      },
    })

    Vue.component('AppDialog', AppDialog)
  },
}

export default Plugin
