<script lang="ts" setup>
import Signup from '~/components/login/index.vue'
</script>

<script lang='ts'>
export const onBeforeRender = (pageContext: any) => {

  return {
    pageContext: {
      documentProps: {
        title: 'Register',
        layout: 'default'
      }
    }
  }
}
</script>

<template>
  <Signup />
</template>


<style lang="scss" scoped>
</style>
