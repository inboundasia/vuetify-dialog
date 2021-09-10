import Vue from 'vue'
import AppDialog from './AppDialog'

export default class {
  constructor(dependency) {
    this.dependency = dependency
  }

  show(propsData) {
    const DialogComponent = Vue.extend(AppDialog)
    const instance = new DialogComponent({
      parent: window.$nuxt.$root, // 將此元件的父實例指定為當前組件樹的Vue實例
      ...this.dependency,
      propsData,
      $dialog: this,
    }).$mount()
    document
      .querySelector('#__nuxt .v-application--wrap')
      .appendChild(instance.$el)
    return instance
  }
}
