<template>
  <div class="login">
    <LoginWidget />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LoginWidget from '@/components/LoginWidget.vue' // @ is an alias to /src

@Component( {
  components: {
    LoginWidget,
  },
} )
export default class Home extends Vue {}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../components/_theme";
div {
  margin: 0;
  padding: 0;
  height: 100vh;
}
.login {
  @extend %flexColumnEnvelope;
  justify-content: center;
  height: 100%;
}

</style>
