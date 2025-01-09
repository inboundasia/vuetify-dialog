// src/index.js
import './style.css'
import useAppDialog from './composables/useAppDialog';
import AppDialog from './components/AppDialog.vue';
import AppDialogInner from './components/AppDialogInner.vue';

// Install function to allow the component to be registered globally
const install = (app) => {
  app.component('AppDialogInner', AppDialogInner);
  app.component('AppDialog', AppDialog);
  app.provide('useAppDialog', useAppDialog);
};

// Export the component and install function
export { AppDialog, AppDialogInner, useAppDialog };