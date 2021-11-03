<template>
  <div>
    <Menu />
    <FlashMessage />
    <slot />
    <Footer />
  </div>
</template>

<script lang='ts'>
import FlashMessage from '~/components/base/FlashMessage.vue'
import Footer from '~/components/base/Footer.vue'

export default {
  components: {
    FlashMessage,
    Footer,
  },

  mounted() {
    // this.$store.dispatch('task/fetchTasks', { userID: 'me' })
    // this.$store.dispatch('users/get_users')
  },
}
</script>

<style>
.member-spacer {
  padding-top: 52px;
}
</style>
