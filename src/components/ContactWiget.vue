/* eslint-disable prettier/prettier */
<template>
  <div
    class="contactEnvelope"
    :class="{ selectedBackground: isSelected }"
    @click="setSelectedNickname"
  >
    <div class="avatarEnvelope">
      <Avatar :imageViewport="viewport" :nickname="nickname" />
    </div>
    <div
      :style="{width: (contactSizeWidth-83) + 'px'}"
      class="nickname"
      :title="nickname"
      :class="{ selectedColor: isSelected, unselectedColor: !isSelected }"
      v-if="wideMode"
    >{{nickname}}</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Avatar from './Avatar.vue'

// importing interfaces:
/* eslint-disable no-unused-vars */
import IImageViewport from './IImageViewport'
import IUser from './IUser'
/* eslint-enable no-unused-vars */

@Component( {
  components: {
    Avatar,
  },
} )
export default class ContactWidget extends Vue {
  @Prop() private nickname!: string
  @Prop( { default: false } ) private isSelected?: boolean
  @Prop( { default: true } ) private wideMode?: boolean
  @Prop() private contactSizeWidth!: number

  contactSizeWidth_:number = 100

  private setSelectedNickname(): void {
    this.$emit( 'setSelectedNickname', {
      selectedNickname: this.nickname
    } )
  }

  get viewport(): IImageViewport {
    return (
      <IUser>this.$store.getters.GET_USER_BY_NICKNAME( this.nickname )
    ).avatarViewport
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="true" lang="scss">
@import "./theme";

// ----- Dynamically linked classes -----
.selectedBackground {
  background-color: $backgroundColorActive;
}
.selectedColor {
  color: $colorBybackgroundColorActive;
}
.unselectedColor {
  color: $colorBybackgroundColorInactive;
}

// ----- Static (DOM) linked classes -----
.contactEnvelope {
  @extend %flexRowContainer;
  @extend %borderedBlock;
  justify-content: left;
  cursor: pointer;
  .avatarEnvelope {
    padding: $standardPadding;
  }
  .nickname {
    @extend %baseFont;
    padding: 0 $standardPadding;
    margin-left: 0;
    // hyphens: auto;
    // -moz-hyphens: auto;
    // -webkit-hyphens: auto;
    // -ms-hyphens: auto;
    word-wrap: break-word;
  }
}
</style>
