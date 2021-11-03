<template>
  <div>
    <form
      method="post"
      name="form3"
      class="fadeIn animated"
      style="visibility: visible; animation-duration: 3s; animation-delay: 0.3s; animation-name: fadeIn;"
      @submit.prevent="handleSubmit"
    >
      <input id="email" v-model:value="username" name="email" type="text" class="textbox1 textbox1_50 title_box_short" placeholder="Email *">
      <input id="password" v-model:value="password" name="password" type="password" class="textbox1 textbox1_50 title_box_short" placeholder="******">
      <input name="imageField" type="Submit" value="Login" border="0" class="main_btn">
    </form>
    <br>
    <a href="#" class="main_btn">Sign up via Facebook</a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  props: {
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
  },
  data(ctx) {
    // console.log('context', ctx.$store)
    return {
      submitted: false,
      username: ctx.defaultUsername,
      password: ctx.DefaultPassword
    }
  },
  computed: {
    // ...mapState('login', ['status'])
  },
  mounted() {
    // https://docs.mongodb.com/stitch/authentication/facebook/
    // if (!stitchClient.auth.isLoggedIn) {
    //   const credential = new FacebookRedirectCredential()
    //   Stitch.defaultAppClient.auth.loginWithRedirect(credential)
    // }
  },
  created() {
    // reset login status
    // this.logout()
  },
  methods: {
    // ...mapActions('login', ['login', 'logout']),
    async handleSubmit() {
      this.submitted = true
      const { username, password } = this
      // console.log('login2?', username, password)
      // console.log('login', username, password, this)
      if (username && password) {
        try {
          let res = await this.$store.dispatch('session/login', {
            username,
            password
          })

          console.log(`successfully register in with id: ${res.uid}`)
          // const res = await this.login({ username, password })
          // console.log("login good", res)
          // this.$router.push(this.$route.query.redirect || '/')
        } catch (e) {
          this.$store.dispatch('alert/error', e.message)
          console.error('login failed', e)
        }
      } // username
      this.submitted = false
    } // handleSubmit
  }
}
</script>

<style lang='scss'>
</style>
