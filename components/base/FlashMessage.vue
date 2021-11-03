
<script setup lang="ts">
import { useAlertStore } from '~/store/alert'
import RouterLink from '~/renderer/Link.vue'

const alertStore = useAlertStore()
const fixDuration = 2

const { link, linkLabel, error, success } = alertStore.$state;
const message = alertStore.$state.error

const alertType = success ? 'alert-success' : (error ? 'alert-error' : '');

const $t = (msg: string) => msg.replace("GraphQL error:", "")
const clearAlert = () => {
  return alertStore.clear()
}

</script>
<template>
  <div v-if="message && message.length > 0" :class="`alert ${alertType}`">
    <span class="pin-r pr-2 cursor-pointer" @click="clearAlert()">&cross;</span>
    {{ $t(message || '') }}
    <span v-if="link">
      <router-link :to="link">{{ linkLabel !== null ? linkLabel : link }}</router-link>
    </span>
  </div>
</template>


<style scoped>
.flashm {
  z-index: 10;
}

.fix {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
