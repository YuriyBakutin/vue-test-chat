<template>
  <div class="chat">
    <ChatWidget :propNickname="detachedWatcherNickname" />
    <ChatWidget />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ChatWidget from '@/components/ChatWidget.vue' // @ is an alias to /src

@Component( {
  components: {
    ChatWidget,
  },
} )
export default class Chat extends Vue {
  private detachedWatcherNickname: string = null
  private sessionUserNickname: string = null

  mounted() {
    this.sessionUserNickname = this.$store.getters.GET_SESSION_USER_NICKNAME
    if ( !this.sessionUserNickname ) {
      this.$router.push( 'login' )
    }
    const nicknames: string[] = this.$store.getters.GET_NICKNAMES
    this.detachedWatcherNickname = nicknames.find( ( nickname: string ) => nickname != this.sessionUserNickname )
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../components/_theme";
div {
  margin: 0;
  padding: 0;
  height: 100vh;
}
.chat {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
}

</style>
