/* eslint-disable prettier/prettier */
<template>
  <div class="MessageWidgetEnvelope">
    <MessageWidget
      v-for="messageId in messagesIds"
      v-bind:key="messageId"
      :watcherNickname="watcherNickname"
      :messageId="messageId"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MessageWidget from './MessageWidget.vue'

// importing interfaces:
/* eslint-disable no-unused-vars */
import IMessage from './IMessage'
/* eslint-enable no-unused-vars */

@Component( {
  components: {
    MessageWidget,
  },
} )
export default class CorrespondenceWidget extends Vue {
  @Prop() private watcherNickname!: string
  @Prop() private correspondentNickname!: string

  get allMessages(): IMessage[] {
    return this.$store.getters.GET_ALL_CORRESPONDENCE
  }

  get messagesIds(): number[] {
    const filtredMessages = this.allMessages.filter( ( message: IMessage ) =>
      (
        message.authorNickname == this.watcherNickname
        && message.correspondentNickname == this.correspondentNickname
      )
      || (
        message.authorNickname == this.correspondentNickname
        && message.correspondentNickname == this.watcherNickname
      )
    )

    const sortedMessages = filtredMessages.sort(
      ( a: IMessage, b: IMessage ) => a.id - b.id
    )

    const messagesIds_ = sortedMessages.map( ( message: IMessage ) => message.id )

    return messagesIds_
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="true" lang="scss">
@import "./theme";

.MessageWidgetEnvelope {
  z-index: 10;
  width: 100%;
  padding: 0;
}
</style>
