<template>
  <form @submit.prevent="submitVerifyEmail">
    <input
      v-model="verifyEmail"
      placeholder="enter email here"
      class="textbox1 textbox1_50 title_box_short"
    />
    <button type="submit" :disabled="loading" class="main_btn" @click="submitVerifyEmail">Submit</button>

    <div style="height: 35px" />
  </form>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { useAclStore } from '~/store/acl'
import { useAlertStore } from '~/store/alert';

const $route = useRoute();
const aclStore = useAclStore()
const alertStore = useAlertStore()
const loading = aclStore.$state.loading
const verifyEmail = ref<string>($route.query.email as string)

const submitVerifyEmail = async () => {
  if (!verifyEmail) {
    alert('please enter email')
    return
  }
  alertStore.clear()

  try {
    aclStore.sendVerifyEmail(verifyEmail.value)
    alertStore.setSuccess('Verification email has been sent!');
  } catch (e: any) {
    alertStore.setError(e.message);
  }
}
</script>

<style scoped>
form {
  display: block;
}
</style>
