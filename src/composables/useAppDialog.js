import { v4 as uuidv4 } from 'uuid'
import { ref, markRaw } from 'vue'

const components = ref([])
const instances = ref([])

export default function useAppDialog() {

  function show({ props = {}, component, persistent, options }) {
    const uuid = uuidv4()
    components.value.push({
      uuid,
      component: markRaw(component),
      props,
      persistent,
      options,
    })
    return uuid
  }

  return {
    components,
    instances,
    show,
    open: show, // alias
    async close(componentUuid) {
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
    },
  }
}
