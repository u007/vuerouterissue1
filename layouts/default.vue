<script lang="ts" setup>
import {
  Layout as ALayout
} from 'ant-design-vue'

const ALayoutHeader = ALayout.Header
const ALayoutContent = ALayout.Content
import FlashMessage from '~/components/base/FlashMessage.vue'
import Footer from '~/components/base/Footer.vue'

</script>

<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />

      <a-layout-content class="contentBody">
        <FlashMessage />
        <slot />
      </a-layout-content>

      <Footer />
    </a-layout>
  </a-layout>
</template>



<style>
</style>
