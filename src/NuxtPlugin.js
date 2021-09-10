import DialogManager from './DialogManager'

export default ({ app }, inject) => {
  inject(
    'dialog',
    new DialogManager({
      vuetify: app.vuetify,
      store: app.store,
      $axios: app.$axios,
      $dialog: app.$dialog,
    })
  )
}
