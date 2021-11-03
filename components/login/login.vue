
<script lang='ts' setup>
import {
  Button as AButton,
  Form as AForm,
  // InputNumber as AInputNumber,
  Input as AInput,
  // Select as ASelect,
  // Radio as ARadio,
  // Spin as ASpin,
  // Switch as ASwitch,
} from 'ant-design-vue'
// import { default as AIcon } from '@ant-design/icons-vue'
import { ref } from 'vue';

import { useAlertStore } from '~/store/alert';
import { useAclStore } from '~/store/acl';
import { useRoute, useRouter } from 'vue-router';
const AFormItem = AForm.Item

const alertStore = useAlertStore()
const aclStore = useAclStore()

const props = defineProps({
  defaultUsername: {
    default: '',
    type: String
  },
  defaultPassword: {
    default: '',
    type: String
  },
  title: {
    default: 'Login',
    type: String
  }
})

const $route = useRoute()
const $router = useRouter()
console.log('router?', $route, $router)

const username = ref('')
const password = ref('')
const submitted = ref(false)
const loading = ref(false)
const redirect = $route.query.redirect as string || '/'

const handleSubmit = async () => {
  alertStore.clear()

  submitted.value = true
  // console.log('???', username, password)

  if (!username || !password) {
    alertStore.setError('please enter username and password')
    return
  }
  try {

    const user = await aclStore.loginEmail(username.value, password.value)
    if (user === null) {
      throw new Error('Invalid username/password')
    }
    console.log(`successfully logged in with id`, user)

    $router.push(redirect)
  } catch (e: any) {
    console.error('login failed', e)
    alertStore.setError(e.message)
  }
  loading.value = false
} // handleSubmit
</script>

<template>
  <div>
    <a-form layout="vertical" method="post" name="form3" @submit.prevent="handleSubmit">
      <a-form-item label="Email">
        <a-input v-model:value="username" type="text" placeholder="email"></a-input>
      </a-form-item>

      <a-form-item label="Password">
        <a-input v-model:value="password" type="password" autocomplete="false"></a-input>
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          class="login-button w-full"
          :loading="loading"
        >Login</a-button>
      </a-form-item>
    </a-form>
    <br />

    <div>
      <a href="/reset-password" style=" text-decoration: underline;" />
    </div>
    <br />
  </div>
</template>


<style lang="scss" scoped>
.register {
  @apply bg-white p-6;
  min-height: 450px;
  margin: 2em auto;
  width: 700px;
  max-width: 100%;
}
</style>

