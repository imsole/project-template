<template>
  <div class="page-login">
    Login
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {

    }
  },
  mounted() {
    console.log(this);
    this.login();
  },
  methods: {
    async login() {
      let res = await this.$http.common.login({
        mobile : '',
        password : ''
      });
      console.log(res);
    }
  }
}
</script>

<style>

</style>