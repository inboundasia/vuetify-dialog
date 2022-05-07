import Vue from 'vue'
import AppDialog from './AppDialog'

export default class {
  constructor(options) {
    this.options = options
  }

  setDynamicModalContainer(root) {
    this.root = root
  }

  show(propsData) {
    const DialogComponent = Vue.extend(AppDialog)
    const instance = new DialogComponent({
      parent: this.root,
      propsData,
    }).$mount()
    document
      .querySelector(this.options?.container || '#__nuxt .v-application--wrap')
      .appendChild(instance.$el)
    return instance
  }
}
