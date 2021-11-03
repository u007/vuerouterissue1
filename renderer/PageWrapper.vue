<template>
  <div class="layout">
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Link from './Link.vue'

const props = defineProps({
  aaa: {
    type: String,
    default: ''
  }
})

console.log('page wrapper', props);
</script>

<style lang='scss'>
</style>

<style scoped>
</style>
