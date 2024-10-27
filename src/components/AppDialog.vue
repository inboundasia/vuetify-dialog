<template>
  <div id="__off-document__dialog">
    <AppDialogInner
      v-for="(component, index) in components"
      :key="index"
      :index="index"
      :persistent="component.persistent || true"
      @opened="(vNode) => onOpened(vNode, component)"
      @closed="(vNode) => onClosed(vNode, component)"
    >
      <component
        :is="{ ...component.component }"
        v-bind.sync="component.props"
      />
    </AppDialogInner>
  </div>
</template>

<script setup>
import AppDialogInner from './AppDialogInner.vue'
import useAppDialog from '../composables/useAppDialog'

const { components, instances } = useAppDialog()

const onOpened = (instance) => {
  instances.value.push(instance);
};

const onClosed = (vNode, component) => {
  const componentIndex = components.value.findIndex((c) => c === component)
  if (componentIndex !== -1) {
    components.value.splice(componentIndex, 1)
  }
  const vNodeIndex = instances.value.findIndex((v) => v === vNode)
  if (vNodeIndex !== -1) {
    instances.value.splice(vNodeIndex, 1)
  }
};
</script>
