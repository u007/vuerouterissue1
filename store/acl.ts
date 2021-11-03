import { defineStore } from "pinia";
// import { getRealm } from "~/realm/setup";

export type User = {
  id: string
  username?: string
  accessToken: string | null
  refreshToken: string | null
  avatar?: string
}

export const useAclStore = defineStore('acl', {
  state: () => {
    return {
      loading: false,
      currentUser: {} as User,
      loginError: '' as string
    }
  },
  actions: {
    async loginEmail(email: string, pass: string) {
      this.loginError = ''
      this.loading = true
      try {
        // const realm = getRealm()
        // const credentials = Realm.Credentials.emailPassword(email, pass)
        // const res = await realm.logIn(credentials);
        // console.log('loggedin?', res)
        // this.currentUser = {
        //   id: res.id,
        //   username: res.profile.name,
        //   avatar: res.profile.pictureUrl,
        //   accessToken: res.accessToken,
        //   refreshToken: res.refreshToken,
        // }
        // return res
      } catch (err) {
        console.log('login failed', err)
      } finally {
        this.loading = true
      }

    },
    async sendVerifyEmail(email: string) {
      this.loading = true
      try {

      } finally {
        this.loading = false
      }
    },
  }
});
