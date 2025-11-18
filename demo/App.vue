<!-- demo/App.vue -->
<template>

  <h1>AppDialog Demo</h1>
  <button @click="showDialog">Show Dialog</button>

  <ul>
    <li v-for="message in messages">{{ message }}</li>
  </ul>

  <AppDialog />
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import AppDialog from '../src/components/AppDialog.vue';
import useAppDialog from '../src/composables/useAppDialog';

const $dialog = useAppDialog();
const messages = ref([]);

function showDialog() {
  $dialog.show({
    component: defineAsyncComponent(() => import('./Example.vue')),
    props: {
      title: 'First Level',
    }
  })
}
</script>

<style>
/* Add any demo-specific styles here */
</style>