<template>
  <div class="avatarCanvasEnvelope" v-bind:title="nickname">
    <canvas
      ref="avatarCanvas"
      class="avatarCanvas"
      v-bind:width="avatarCanvasSize"
      v-bind:height="avatarCanvasSize"
      v-bind:title="nickname"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import IImageViewport from './IImageViewport'

@Component
export default class Avatar extends Vue {
  @Prop() private imageViewport?: IImageViewport
  @Prop( { default: '' } ) private nickname: string
  @Prop( { default: true } ) private showContext: boolean
  @Prop( { default: true } ) private showImage: boolean

  private avatarCanvasSize = 48
  private avatarCanvas: HTMLCanvasElement = null
  private avatarCanvasContext: CanvasRenderingContext2D = null

  @Watch( 'imageViewport' )
  onImageViewportChanged() {
    this.makeAvatar()
  }

  @Watch( 'nickname' )
  onNicknameChanged() {
    this.makeAvatar()
  }

  @Watch( 'showContext' )
  onShowContextChanged() {
    this.makeAvatar()
  }

  @Watch( 'showImage' )
  onShowImageChanged() {
    this.makeAvatar()
  }
  mounted() {
    this.avatarCanvas = <HTMLCanvasElement>this.$refs.avatarCanvas
    this.avatarCanvasContext = this.avatarCanvas.getContext( '2d' )
    this.avatarCanvasContext.imageSmoothingEnabled = true
    this.avatarCanvasContext.imageSmoothingQuality = "high"
    this.makeAvatar()
  }

  makeAvatar(): void {
    this.avatarCanvas.height = this.avatarCanvasSize

    if ( !this.showContext ) {
      return
    }
    this.avatarCanvasContext.globalAlpha = 1.0
    this.avatarCanvasContext.beginPath()

    const avatarCanvasRadius = this.avatarCanvasSize / 2

    this.avatarCanvasContext.arc(
      avatarCanvasRadius,
      avatarCanvasRadius,
      avatarCanvasRadius,
      0,
      Math.PI * 2
    )

    this.avatarCanvasContext.clip()

    this.avatarCanvasContext.fillStyle = 'gray'
    this.avatarCanvasContext.fillRect(0, 0, this.avatarCanvasSize, this.avatarCanvasSize);

    if ( !this.showContext ) {
      return
    }

    if ( this.imageViewport && this.showImage ) {
      this.avatarCanvasContext.drawImage(
        this.imageViewport.imageElement,
        this.imageViewport.imageForAvatarX,
        this.imageViewport.imageForAvatarY,
        this.imageViewport.imageForAvatarWidth,
        this.imageViewport.imageForAvatarHeight
      )
    } else {
      this.avatarCanvasContext.font = 'bold 38px "Open Sans"'
      this.avatarCanvasContext.fillStyle = 'black'
      this.avatarCanvasContext.textAlign = 'center'
      this.avatarCanvasContext.fillText(!this.nickname ? '' : this.nickname[0], 24, 38);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./theme";

.avatarCanvasEnvelope {
  border: none;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: $controlShadow;
  padding: 0;
  width: 48px;
  min-width: 48px;
  height: 48px;
  background-color: $backgroundColorActive;
  .avatarCanvas {
    z-index: 10;
  }
}
</style>
