<template>
  <div id="__off-document__dialog">
    <div
      class="v-iba-overlay v-iba-overlay--active"
      :class="{ 'theme--dark': isDark, 'theme--light': !isDark }"
      :style="{ 'z-index': $attrs.index + 1008 }"
    >
      <div
        class="v-iba-overlay__scrim"
        :style="{
          opacity: overlayActive ? 0.46 : 0,
          'background-color': isDark ? 'rgb(33, 33, 33)' : 'rgb(0, 0, 0)',
          'border-color': isDark ? 'rgb(33, 33, 33)' : 'rgb(0, 0, 0)'
        }"
        @click="onOverlayClicked"
      ></div>
      <div class="v-iba-overlay__content"></div>
    </div>
    <div
      role="document"
      tabindex="0"
      class="v-iba-dialog__content v-iba-dialog__content--active"
      :style="{ 'z-index': $attrs.index + 1009 }"
    >
      <div
        class="v-iba-dialog v-iba-dialog--persistent"
        :class="{
          'v-iba-dialog--active': contentActive,
          'v-iba-dialog--dark': isDark,
          'v-iba-dialog--light': !isDark
        }"
        :style="{
          'transform-origin': 'center center',
          width: '425px',
          'background-color': isDark ? 'rgb(30, 30, 30)' : '#fff',
          color: isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'

export default {
  data() {
    return {
      overlayActive: false,
      contentActive: false,
      animationDelay: 150, // Animation delay in milliseconds
      isDark: false,
      themeObserver: null,
      mediaQuery: null,
    }
  },
  mounted() {
    // Detect theme from Vuetify if available
    this.detectTheme()

    // Watch for theme changes
    this.watchTheme()

    // Re-detect theme after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.detectTheme()
    }, 100)

    // Use nextTick to ensure DOM is ready, then trigger animation
    this.$nextTick(() => {
      setTimeout(() => {
        this.overlayActive = true
        this.contentActive = true
      }, 10) // Small delay to trigger CSS transition
    })

    this.$emit('opened', this)
  },
  beforeUnmount() {
    // Clean up observers
    if (this.themeObserver) {
      this.themeObserver.disconnect()
    }
    if (this.mediaQuery) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener('change', this.detectTheme)
      } else if (this.mediaQuery.removeListener) {
        this.mediaQuery.removeListener(this.detectTheme)
      }
    }
  },
  methods: {
    detectTheme() {
      try {
        if (typeof window === 'undefined') return

        const html = document.documentElement
        const oldIsDark = this.isDark

        // Method 1: Check document class (Vuetify adds v-theme--dark) - Most reliable
        if (html.classList.contains('v-theme--dark')) {
          this.isDark = true
        } else if (html.classList.contains('v-theme--light')) {
          this.isDark = false
        }
        // Method 2: Check data attribute
        else {
          const themeAttr = html.getAttribute('data-v-theme')
          if (themeAttr === 'dark') {
            this.isDark = true
          } else if (themeAttr === 'light') {
            this.isDark = false
          }
          // Method 3: Check for dark class
          else if (html.classList.contains('dark') || document.body.classList.contains('dark')) {
            this.isDark = true
          }
          // Method 4: Try to get from Vuetify instance
          else {
            try {
              const instance = getCurrentInstance()
              if (instance) {
                const vuetify = instance.appContext?.config?.globalProperties?.$vuetify
                if (vuetify?.theme?.global?.name) {
                  const themeName = typeof vuetify.theme.global.name === 'object'
                    ? vuetify.theme.global.name.value
                    : vuetify.theme.global.name
                  this.isDark = themeName === 'dark'
                }
              }
            } catch (e) {
              // Continue to next method
            }
          }
        }

        // Method 5: Check prefers-color-scheme (last resort, only if not set)
        if (this.isDark === oldIsDark && !html.classList.contains('v-theme--dark') && !html.classList.contains('v-theme--light')) {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true
          } else {
            this.isDark = false
          }
        }

        // Force reactivity update if changed
        if (oldIsDark !== this.isDark) {
          this.$forceUpdate()
        }
      } catch (e) {
        // Silently fail and use default
        console.debug('Could not detect theme:', e)
        this.isDark = false
      }
    },
    watchTheme() {
      if (typeof window === 'undefined') return

      // Watch for Vuetify theme changes via MutationObserver
      this.themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' &&
              (mutation.attributeName === 'class' || mutation.attributeName === 'data-v-theme')) {
            this.detectTheme()
          }
        })
      })

      // Observe html element for class changes
      if (document.documentElement) {
        this.themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class', 'data-v-theme'],
          subtree: false
        })
      }

      // Also observe body for dark class
      if (document.body) {
        this.themeObserver.observe(document.body, {
          attributes: true,
          attributeFilter: ['class'],
          subtree: false
        })
      }

      // Watch for prefers-color-scheme changes
      if (window.matchMedia) {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        if (this.mediaQuery.addEventListener) {
          this.mediaQuery.addEventListener('change', this.detectTheme)
        } else if (this.mediaQuery.addListener) {
          // Fallback for older browsers
          this.mediaQuery.addListener(this.detectTheme)
        }
      }
    },
    onOverlayClicked() {
      if (!this.$attrs.persistent) {
        this.close()
      }
    },
    close() {
      this.overlayActive = false
      this.contentActive = false
      setTimeout(() => {
        this.$emit('closed', this)
      }, this.animationDelay)
    },
  },
}
</script>

<style>
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

.v-iba-dialog--dark {
  background-color: rgb(30, 30, 30);
  color: rgba(255, 255, 255, 0.87);
  box-shadow: 0 11px 15px -7px rgb(0 0 0 / 40%),
    0 24px 38px 3px rgb(0 0 0 / 30%), 0 9px 46px 8px rgb(0 0 0 / 25%);
}

.v-iba-dialog--light {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
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
