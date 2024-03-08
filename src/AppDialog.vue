<template>
  <div v-if="dialogVisible" id="__off-document__dialog">
    <div
      class="v-iba-overlay v-iba-overlay--active theme--dark"
      style="z-index: 201"
    >
      <div
        class="v-iba-overlay__scrim"
        :style="{ opacity: overlayActive ? 0.46 : 0 }"
        style="background-color: rgb(33, 33, 33); border-color: rgb(33, 33, 33)"
      ></div>
      <div class="v-iba-overlay__content"></div>
    </div>
    <div
      role="document"
      tabindex="0"
      class="v-iba-dialog__content v-iba-dialog__content--active"
      style="z-index: 202"
    >
      <div
        class="v-iba-dialog v-iba-dialog--persistent"
        :class="{ 'v-iba-dialog--active': contentActive }"
        :style="`transform-origin: center center; width: ${width}px`"
      >
        <component
          :is="component"
          ref="Component"
          v-dynamic-events="listeners"
          v-bind.sync="props"
        />
      </div>
    </div>
  </div>
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
      overlayActive: false,
      contentActive: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.overlayActive = true
      this.contentActive = true
    }, 100)
  },
  methods: {
    close(...args) {
      this.overlayActive = false
      this.contentActive = false
      setTimeout(() => {
        this.dialogVisible = false
        this.$nextTick(() => {
          this.$destroy()
        })
      }, 500)
    },
  },
}
</script>

<style scoped>
.v-iba-overlay {
  align-items: center;
  border-radius: inherit;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;
}

.v-iba-overlay--active {
  pointer-events: auto;
}

.v-iba-overlay__scrim {
  border-radius: inherit;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: inherit;
  width: 100%;
  will-change: opacity;
}

.v-iba-overlay__content {
  position: relative;
}

.v-iba-dialog {
  border-radius: 4px;
  margin: 24px;
  overflow-y: auto;
  pointer-events: auto;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  z-index: inherit;
  box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%),
    0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%);
}

.v-iba-dialog__content {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), z-index 1ms;
  width: 100%;
  z-index: 6;
  outline: none;
}

.v-iba-dialog {
  max-height: 0;
}

.v-iba-dialog--active {
  max-height: 90%;
}
</style>
