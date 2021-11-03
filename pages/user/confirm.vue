<template>
  <div>
    <h1 class="title">{{ title }}</h1>

    <div
      class
      style="visibility: visible; animation-duration: 2s; animation-delay: 0.2s; animation-name: fadeIn;"
    >
      <!--content img-->
      <div
        class="content_img"
        style="height: 800px; visibility: visible; animation-duration: 2s; animation-delay: 0.4s; animation-name: fadeIn; vertical-align: top;"
      >
        <div class="fader" />
        <div class="img_col dynamic_img" style></div>
      </div>
      <!--end content img-->

      <form style="frm">
        <fieldset>
          <legend>Confirming email</legend>
          <div v-if="!confirmed">Please wait...</div>
          <div v-else>
            <router-link to="/">Click here to login</router-link>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
// import { getRealm } from '~/realm/setup';

const $route = useRoute();

const token = $route.query.token
const tokenId = $route.query.tokenId
const confirmed = ref(false);
const loading = ref(false);
const doConfirm = async () => {
  try {
    loading.value = true
    // const realm = getRealm()
    // await realm.emailPasswordAuth.confirmUser(this.token, this.tokenId);

    this.$store.dispatch('alert/success', 'You email has been confirmed!')
    this.confirmed = true
  } catch (e) {
    this.$store.dispatch('alert/error', e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style lang='scss'>
#newsletter {
  margin-top: 40px;
  display: block;
  background: #fff;
  font: 14px Helvetica, Arial, sans-serif;
}

.indicates-required {
  padding: 3px;
}

.frm {
  margin-left: 450px;
}

@media (max-width: 1150px) {
  .frm {
    margin-left: 0;
  }
}
</style>
