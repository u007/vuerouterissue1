<template>
  <a-layout id="components-layout-demo-custom-trigger" class="min-h-full">
    <!-- <Sidebar /> -->
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 5px 5px 25px">TODO</a-layout-header>

      <a-layout-content class="contentBody">
        <FlashMessage />
        <slot />
      </a-layout-content>

      <Footer />
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
// import { Layout as ALayout } from 'ant-design-vue'
import FlashMessage from '~/components/base/FlashMessage.vue'
import Footer from '~/components/base/Footer.vue'
// import Sidebar from '~/components/base/Sidebar.vue'

export default {
  components: {
    // ALayoutContent,
    // ALayout,
    // ALayoutHeader,
    FlashMessage,
    // Sidebar,
    Footer,
  },
}
</script>

<style>
</style>
