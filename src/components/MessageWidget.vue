/* eslint-disable prettier/prettier */
<template>
  <div
    class="messageEnvelope"
    :class="{correspondentMessage: correspondentIsWatcher}"
    :title="messageTimestampString"
  >
    <Avatar
      :imageViewport="avatarViewport"
      :nickname="authorNickname"
    />
    <div class="message"
    >
      <div class="messageLine"
        v-for="( messageLine, index ) in messageTextLines"
        :key="index"
        :class="{ emtyLine: messageLine == '' }"
      >
        {{messageLine}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Avatar from './Avatar.vue'

// importing interfaces:
/* eslint-disable no-unused-vars */
import IImageViewport from './IImageViewport'
import IUser from './IUser'
import IMessage from './IMessage'
/* eslint-enable no-unused-vars */

@Component( {
  components: {
    Avatar,
  },
} )
export default class MessageWidget extends Vue {
  @Prop() private watcherNickname!: string
  @Prop() private messageId!: number

  private message: IMessage = null
  private avatarViewport: IImageViewport = null
  private authorNickname: string = null
  private correspondentIsWatcher: boolean = null
  private messageTextLines: string[] = null
  private messageTimestampString: string = null

  mounted() {
    this.message = this.$store.getters.GET_MESSAGE_BY_ID( this.messageId )
    this.messageTextLines = this.message && this.message.messageText.split( '\n' )
    this.messageTimestampString = this.message && (
      new Intl.DateTimeFormat( 'ru', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      } ).format( new Date( this.message.timestamp ) )
    )

    const author: IUser = this.$store.getters.GET_USER_BY_NICKNAME( this.message.authorNickname )
    this.avatarViewport = author.avatarViewport
    this.authorNickname = author.nickname
    this.correspondentIsWatcher = this.message.correspondentNickname == this.watcherNickname
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="true" lang="scss">
@import "./theme";
// ----- Dynamically linked classes -----
.correspondentMessage {
  background-color: $backgroundColorActive;
  color: $colorBybackgroundColorActive !important;
}
// ----- Static (DOM) linked classes -----
.messageEnvelope {
  @extend %flexRowContainerBottom;
  @extend %borderedBlock;
  justify-content: left;
  padding: 5px;
  color: $colorBybackgroundColorInactive;
  .message {
    word-break: break-all;
    .emtyLine {
      height: $emtyLineHeight;
    }
    .messageLine {
      padding: 0 5px;
    }
  }
}

</style>
