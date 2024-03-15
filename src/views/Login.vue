<template>
  <div id="building">
    <component :is="component" @switch="changeComponent"></component>
  </div>
</template>

<script>

import LoginForm from "@/components/LoginForm";
import RegistForm from "@/components/RegistForm";

export default {
  name: "Login",
  components: {LoginForm, RegistForm},
  data() {
    return {
      component: "LoginForm",
    }
  },
  methods: {
    changeComponent: function () {
      if (this.component == "LoginForm") {
        this.component = "RegistForm"
      } else {
        this.component = "LoginForm"
      }
    }
  }
  ,
  computed: {}
}
</script>

<style>


</style>