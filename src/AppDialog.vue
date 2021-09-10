<template>
  <v-dialog
    v-model="dialogVisible"
    eager
    :width="width"
    persistent
    @closed="close"
  >
    <component
      :is="component"
      ref="Component"
      v-dynamic-events="listeners"
      v-bind.sync="props"
    />
  </v-dialog>
</template>

<script>
export default {
  name: 'AppDialog',
  directives: {
    DynamicEvents: {
      bind: (el, binding, vnode) => {
        const allEvents = binding.value
        if (allEvents) {
          Object.keys(allEvents).forEach((event) => {
            vnode.componentInstance.$on(event, (eventData) => {
              const callback = allEvents[event]
              if (callback) {
                callback(eventData)
              }
            })
          })
        }
      },
    },
  },
  props: {
    width: {
      type: String,
      default: '425',
    },
    component: {
      type: [Function, Object],
      required: true,
    },
    props: {
      type: Object,
      default: () => {
        return {}
      },
    },
    listeners: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      dialogVisible: true,
    }
  },
  methods: {
    close(...args) {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$destroy()
      })
    },
  },
}
</script>
