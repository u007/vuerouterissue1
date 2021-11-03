<template>
  <h1>Welcome</h1>This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>
      Interactive.
      <Counter />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import Counter from './Counter.vue'
</script>

<script lang='ts'>
export const onBeforeRender = (pageContext: any) => {

  return {
    pageContext: {
      documentProps: {
        title: 'hahaha',
        layout: 'default'
      }
    }
  }
}

</script>
