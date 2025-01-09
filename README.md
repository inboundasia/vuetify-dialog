## Installtion

for vue 2: `npm install vuetify-dialog`
for vue 3: `npm install digitspark-dialog`

# Local Dev

npm run dev

# Publish

npm publish

# Usages

in your global layout add the component `AppDialog`

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

const $dialog = useAppDialog()

function doOpen() {
  $dialog.open({
    component: defineAsyncComponent(() => import('~/components/DialogContent.vue'))
  })
}
</script>
```