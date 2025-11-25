import { ref, markRaw } from 'vue'

// Use global storage to ensure singleton across module instances
const GLOBAL_KEY = '__VUETIFY_DIALOG_INSTANCE__'

// Initialize or retrieve singleton instance from global storage
function getOrCreateInstance() {
  if (typeof window !== 'undefined') {
    if (!window[GLOBAL_KEY]) {
      const components = ref([])
      const instances = ref([])

      // Use native crypto.randomUUID() if available, otherwise fallback to a simple UUID v4 generator
      function generateUUID() {
        // Try browser crypto API
        if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
          return window.crypto.randomUUID()
        }
        // Try Node.js crypto module (for SSR/build time)
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID()
        }
        // Fallback: Generate UUID v4 compatible string
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }

      function show({ props = {}, component, persistent, options }) {
        const uuid = generateUUID()
        components.value.push({
          uuid,
          component: markRaw(component),
          props,
          persistent,
          options,
        })
        return uuid
      }

      async function close(componentUuid) {
        if (componentUuid) {
          const index = components.value.findIndex(
            (component) => component.uuid === componentUuid
          )
          if (index !== -1) {
            await instances.value[index].close()
          }
        } else {
          await instances.value[instances.value.length - 1].close()
        }
      }

      window[GLOBAL_KEY] = {
        components,
        instances,
        show,
        open: show, // alias
        close,
      }
    }
    return window[GLOBAL_KEY]
  }

  // SSR fallback: create module-level singleton
  if (!getOrCreateInstance._instance) {
    const components = ref([])
    const instances = ref([])

    function generateUUID() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }

    function show({ props = {}, component, persistent, options }) {
      const uuid = generateUUID()
      components.value.push({
        uuid,
        component: markRaw(component),
        props,
        persistent,
        options,
      })
      return uuid
    }

    async function close(componentUuid) {
      if (componentUuid) {
        const index = components.value.findIndex(
          (component) => component.uuid === componentUuid
        )
        if (index !== -1) {
          await instances.value[index].close()
        }
      } else {
        await instances.value[instances.value.length - 1].close()
      }
    }

    getOrCreateInstance._instance = {
      components,
      instances,
      show,
      open: show,
      close,
    }
  }
  return getOrCreateInstance._instance
}

export default function useAppDialog() {
  // Always return the same singleton instance from global storage
  return getOrCreateInstance()
}
