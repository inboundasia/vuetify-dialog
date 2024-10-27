<template>
  <h1>Example</h1>
  <div>Pass a title prop {{ title }}</div>
  <button @click="close()">Close</button>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import useAppDialog from '../src/composables/useAppDialog';
const { close } = useAppDialog()
defineProps({ title: String });
</script>