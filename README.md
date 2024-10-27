## Installtion

for vue 2: `npm install vuetify-dialog`
for vue 3: `npm install digitspark-dialog`

# Local Dev

npm run dev

# Publish

npm publish

# Usages

in your global layout add the component `AppDrawer`

```
<script setup>
import { AppDialog } from 'digitspark-dialog'
</script>
```

```
<template>
  <AppDialog />
</template>
```

in other component import the useAppDialog composable

```
<script setup>
import { useAppDialog } from 'digitspark-dialog'

const $drawer = useAppDialog()

function doOpen() {
  $drawer.open({
    component: defineAsyncComponent(() => import('~/components/DrawerContent.vue'))
  })
}
</script>
```