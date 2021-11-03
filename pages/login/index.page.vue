<script lang="ts" setup>
import Signup from '~/components/login/index.vue'
</script>

<template>
  <div>
    <Signup initial-tab="signin" />
  </div>
</template>

<script lang='ts'>
export const onBeforeRender = (pageContext: any) => {

  return {
    pageContext: {
      documentProps: {
        title: 'Login',
        layout: 'default'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
