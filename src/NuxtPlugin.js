import DialogManager from './DialogManager'
import AppDialog from './AppDialog'

// Reference: https://github.com/euvl/vue-js-modal/blob/master/src/Plugin.js
const Plugin = {
  install(Vue, options = {}) {
    if (Vue.prototype.$dialog) {
      return
    }

    const Manager = new DialogManager(options)

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
