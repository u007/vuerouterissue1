<script lang="ts" setup>
import {
  Row as ARow,
  Col as ACol,
  Input as AInput,
  Form as AForm,
  Button as AButton,
  Spin,
  Alert as AAlert,
  FormItem as AFormItem,
  Checkbox as ACheckbox
} from "ant-design-vue";

import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons-vue';
import { defineAsyncComponent, ref } from "vue";
import { useRouter } from 'vue-router'

const LoginComponent = defineAsyncComponent(() => import('./login.vue'))
const props = defineProps({
  initialTab: {
    type: String,
    default: 'signup'
  },
})

const router = useRouter()
// const route = useRoute()
// console.log('route', route, router)
const name = ref('');
const email = ref('');
const pass = ref('');
const agreeTerm = ref(false);
const loading = ref(false);
const error = ref('');
const tab = ref<string>(props.initialTab);
// const notice = ref('');
const signupSuccess = ref(false);

const rowGutter = { xs: 8, sm: 16, md: 24, lg: 32 };
const outerCols = {
  span: 24,
  md: 12,
  lg: 12,
  xl: 12,
}

const signIn = () => {
  tab.value = 'signin';
  router.push('/login');
}

const signUp = async () => {
  signupSuccess.value = false
  error.value = ''
  if (!name.value || !email.value || !pass.value) {
    error.value = "Please fill in the fields"
    return
  }
  if (!agreeTerm.value) {
    error.value = "Please agree to our terms and privacy policy";
    return;
  }
  loading.value = true
  // const realm = getRealm()
  try {
    // const res = await realm.emailPasswordAuth.registerUser(email.value, pass.value);
    // notice.value = "Your account has been created"
    signupSuccess.value = true
  } catch (e: any) {
    if (e.error) {
      error.value = e.error
      return
    }
    error.value = e.message
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="register">
    <a-row :gutter="rowGutter" type="flex">
      <a-col v-bind="outerCols">
        <div v-if="signupSuccess">
          <a-alert message="Your account has been created!" type="error" class="my-4" />
          <div class="my-4">Please check your e-mail to confirm your email...</div>
          <div class="flex mt-4 gap-2">
            <a-button class="flex-grow">Sign In</a-button>
          </div>
        </div>
        <spin :spinning="loading">
          <a-form layout="vertical" v-if="tab == 'signin'">
            <h1>Login</h1>
            <LoginComponent />
            <div class="flex mt-4 gap-2">
              <!-- <a-button type="primary" class="flex-grow" @click="signUp">Sign Up</a-button> -->

              <a-button class="flex-grow" @click="() => tab = 'signup'">Sign Up</a-button>
            </div>
          </a-form>

          <a-form layout="vertical" v-if="tab == 'signup'">
            <h1>Create an account</h1>

            <div class="social text-center">
              <a-button type="link" size="large">
                <FacebookOutlined size="large" />
              </a-button>

              <a-button type="link" size="large">
                <GoogleOutlined />
              </a-button>
            </div>

            <div class="my-4">or use your email for registration:</div>
            <a-form-item label="Name">
              <a-input v-model:value="name" />
            </a-form-item>
            <a-form-item label="Email">
              <a-input v-model:value="email" />
            </a-form-item>

            <a-form-item label="Password">
              <a-input v-model:value="pass" type="password" />
            </a-form-item>

            <div class="mt-4">
              <a-checkbox v-model:checked="agreeTerm">I agree to the Terms and Privacy Policy.</a-checkbox>
            </div>

            <a-alert :message="error" type="error" v-if="error" class="my-4" />

            <div class="flex mt-4 gap-2">
              <a-button type="primary" class="flex-grow" @click="signUp">Sign Up</a-button>

              <a-button class="flex-grow" @click="signIn">Sign In</a-button>
            </div>
          </a-form>
        </spin>
      </a-col>
      <a-col v-bind="outerCols" class="xs:hidden sm:hidden">
        <img src="/img/register.jpg" class="w-full h-full absolute object-cover" />
      </a-col>
    </a-row>
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
