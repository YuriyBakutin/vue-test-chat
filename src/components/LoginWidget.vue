<template>
  <div class="loginnWidget">
    <div class="commonBorder">
      <div class="commonEnvelop" :style="{ width: (widgetWidth + 4) + 'px' }">
        <div class="heder" :style="{ width: widgetWidth + 'px' }">Login</div>
        <div class="avatarImageBlock" :style="{ width: widgetWidth + 'px', height: widgetWidth + 'px' }">
          <canvas ref="imageCanvas" class="imageCanvas" :width="widgetWidth" :height="widgetWidth"></canvas>
          <canvas
            ref="controlCanvas"
            class="controlCanvas"
            :width="widgetWidth"
            :height="widgetWidth"
            @mousedown="captureMouseDown"
            @mousemove="dragStep"
            @mouseup="endOfDrag"
            @mouseout="endOfDrag"
          ></canvas>
          <div class="userIco" ref="userIco" :class="{nodisplay: avatarIsLoaded}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="196"
              height="196"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.0"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </div>
        </div>
        <div class="imageUrlInputBlock" :style="{ width: widgetWidth + 'px' }">
          <div class="imageUrlRequestText">Link to image for your avatar:</div>
          <input ref="imageUrlInput" type="text" @blur="setAvatarImageUrl" :placeholder="errorUrlPlaceholderText"/>
        </div>
        <div class="nameInputBlock" :style="{ width: widgetWidth + 'px' }">
          <div class="nameRequestText">Your nickname:</div>
          <input
            ref="nicknameInput"
            type="text"
            v-model="nickname"
            :class="{inactiveInput: !!sessionUserNickname}"
            :readonly="!!sessionUserNickname"
            :placeholder="errorNicknamePlaceholderText"
            @click="errorNicknamePlaceholderText = ''"
          />
          <div
            class="clearNicknameButton"
            v-if="sessionUserNickname"
            title="clear User"
            @click="clearNickname"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="1 0 23 22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </div>
        </div>
        <div class="confirmBlock" :style="{ width: widgetWidth + 'px' }">
          <Avatar
            title="Avatar"
            :imageViewport="avatarImageViewport"
            :nickname="nickname"
            :showContext="!!nickname || !!avatarImageViewport"
            :showImage="showAvatarImage"
          />
          <div
            title="Clear Avatar"
            class="clearImageButton"
            @click="clearAvatarImage"
            :class="{inactiveButton:
            !showAvatarImage}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="1 0 23 22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </div>
          <div
            title="Submit"
            class="confirmButton"
            :class="{inactiveButton: !nicknameInputed}"
            @click="submit"
          >OK</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Avatar from './Avatar.vue'
import IImageViewport from './IImageViewport'
import IUser from './IUser'

@Component( {
  components: {
    Avatar
  },
} )
export default class LoginWidget extends Vue {
  private nickname: string = null
  // private id: number = null

  private widgetWidth = 336
  private markerSize = 10
  private markerLineWidth = 2
  private selectionEdgePadding = 20
  private avatarCanvasSize = 48
  private minSizeSelection = 36
  private avatarLoadError = false
  private avatarIsLoaded = false
  private avatarImage: HTMLImageElement = null
  private avatarImageUrl: string = null
  private imageCanvas: HTMLCanvasElement = null
  private imageCanvasContext: CanvasRenderingContext2D = null
  private controlCanvas: HTMLCanvasElement = null
  private controlCanvasContext: CanvasRenderingContext2D = null
  private leftSelectionEdge: number = this.selectionEdgePadding
  private rightSelectionEdge: number = this.widgetWidth - this.selectionEdgePadding
  private topSelectionEdge: number = this.selectionEdgePadding
  private bottomSelectionEdge: number = this.widgetWidth - this.selectionEdgePadding
  // Drag and Drop
  private leftSelectionEdgeDragStart: number = null
  private rightSelectionEdgeDragStart: number = null
  private topSelectionEdgeDragStart: number = null
  private bottomSelectionEdgeDragStart: number = null
  private startDragX: number = null
  private startDragY: number = null
  private leftSelectionEdgeDrags: boolean = false
  private rightSelectionEdgeDrags: boolean = false
  private bottomSelectionEdgeDrags: boolean = false
  private topSelectionEdgeDrags: boolean = false
  private controlCanvasLeft: number = null
  private controlCanvasTop: number = null
  private dradStartPointX: number = null
  private dradStartPointY: number = null
  private isDragging: boolean = false
  private directionX: number = null
  private directionY: number = null

  private errorUrlPlaceholderText = ''
  private errorNicknamePlaceholderText = ''
  private avatarImageViewport: IImageViewport = null
  private showAvatar = false
  private showAvatarImage = false

  clearAvatarImage(): void {
    this.avatarImageUrl = null
    this.avatarIsLoaded = false
    this.avatarImage= null
    const imageUrlInput = <HTMLInputElement>this.$refs.imageUrlInput
    imageUrlInput.value = ''
    this.leftSelectionEdge = this.selectionEdgePadding
    this.rightSelectionEdge = this.widgetWidth - this.selectionEdgePadding
    this.topSelectionEdge = this.selectionEdgePadding
    this.bottomSelectionEdge = this.widgetWidth - this.selectionEdgePadding
    this.paint()
    this.avatarImageViewport = null
    this.showAvatarImage = false

  }

  clearNickname(): void {
    this.nickname = null
    this.$store.dispatch( 'CLEAR_SESSION_USER_NICKNAME' )
    console.log( this.$store.getters.GET_SESSION_USER_NICKNAME )
  }

  setAvatarImageUrl(): void {
    const imageUrlInput = <HTMLInputElement>this.$refs.imageUrlInput
    this.avatarImageUrl = imageUrlInput.value
    this.loadImage()
  }

  captureMouseDown( event: MouseEvent ): void {
    const startDragX = event.pageX - this.controlCanvasLeft
    const startDragY = event.pageY - this.controlCanvasTop

    const inLeftSelectionEdge = startDragX >= this.leftSelectionEdge
      && startDragX <= this.leftSelectionEdge + this.markerSize

    const inRightSelectionEdge = startDragX <= this.rightSelectionEdge
      && startDragX >= this.rightSelectionEdge - this.markerSize

    const inTopSelectionEdge = startDragY >= this.topSelectionEdge
      && startDragY <= this.topSelectionEdge + this.markerSize

    const inBottomSelectionEdge = startDragY <= this.bottomSelectionEdge
      && startDragY >= this.bottomSelectionEdge - this.markerSize

    if ( inLeftSelectionEdge && inTopSelectionEdge ) {
      this.directionX = 0.5
      this.directionY = 0.5
    } else if ( inRightSelectionEdge && inTopSelectionEdge ) {
      this.directionX = -0.5
      this.directionY = 0.5
    } else if ( inRightSelectionEdge && inBottomSelectionEdge ) {
      this.directionX = -0.5
      this.directionY = -0.5
    } else if ( inLeftSelectionEdge && inBottomSelectionEdge ) {
      this.directionX = 0.5
      this.directionY = -0.5
    } else {
      return
    }

    this.startDragX = event.pageX
    this.startDragY = event.pageY

    if ( inLeftSelectionEdge ) {
      this.leftSelectionEdgeDragStart = this.leftSelectionEdge
      this.leftSelectionEdgeDrags = true
    } else { // inRightSelectionEdge
      this.rightSelectionEdgeDragStart = this.rightSelectionEdge
      this.rightSelectionEdgeDrags = true
    }

    if ( inTopSelectionEdge ) {
      this.topSelectionEdgeDragStart = this.topSelectionEdge
      this.topSelectionEdgeDrags = true
    } else { // inBottomSelectionEdge
      this.bottomSelectionEdgeDragStart = this.bottomSelectionEdge
      this.bottomSelectionEdgeDrags = true
    }

    this.isDragging = true
  }

  dragStep( event: MouseEvent ): void {
    document.getElementsByClassName( '' )
    if ( !this.isDragging ) {
      return
    }

    const offsetWhenDraggingX = event.pageX - this.startDragX
    const offsetWhenDraggingY = event.pageY - this.startDragY

    let leftSelectionEdge = this.leftSelectionEdge
    let topSelectionEdge = this.topSelectionEdge
    let rightSelectionEdge = this.rightSelectionEdge
    let bottomSelectionEdge = this.bottomSelectionEdge

    if ( this.leftSelectionEdgeDrags ) {
      leftSelectionEdge = this.leftSelectionEdgeDragStart + offsetWhenDraggingX * this.directionX + offsetWhenDraggingY * this.directionY
    }

    if ( this.topSelectionEdgeDrags ) {
      topSelectionEdge = this.topSelectionEdgeDragStart + offsetWhenDraggingY * this.directionY + offsetWhenDraggingX * this.directionX
    }

    if ( this.rightSelectionEdgeDrags ) {
      rightSelectionEdge = this.rightSelectionEdgeDragStart - offsetWhenDraggingX * this.directionX - offsetWhenDraggingY * this.directionY
    }

    if ( this.bottomSelectionEdgeDrags ) {
      bottomSelectionEdge = this.bottomSelectionEdgeDragStart - offsetWhenDraggingX * this.directionX - offsetWhenDraggingY * this.directionY
    }

    if (
      leftSelectionEdge <= 0
      || topSelectionEdge <= 0
      || rightSelectionEdge >= this.widgetWidth
      || bottomSelectionEdge >= this.widgetWidth
      || rightSelectionEdge - leftSelectionEdge < this.minSizeSelection
      || bottomSelectionEdge - topSelectionEdge < this.minSizeSelection
    ) {
      return
    }

    this.leftSelectionEdge = leftSelectionEdge
    this.topSelectionEdge = topSelectionEdge
    this.rightSelectionEdge = rightSelectionEdge
    this.bottomSelectionEdge = bottomSelectionEdge

    this.paint()
  }

  endOfDrag(): void {
    this.isDragging = false

    this.leftSelectionEdgeDrags = false
    this.rightSelectionEdgeDrags = false
    this.topSelectionEdgeDrags = false
    this.bottomSelectionEdgeDrags = false
  }

  mounted() {
    this.$store.dispatch( 'LOAD_USERS' )
    window.addEventListener( 'keyup', this.keyupListner.bind( this ) )
    this.nickname = this.sessionUserNickname
    this.imageCanvas = <HTMLCanvasElement>this.$refs.imageCanvas
    this.imageCanvasContext = this.imageCanvas.getContext( '2d' )
    this.imageCanvasContext.imageSmoothingEnabled = false
    this.controlCanvas = <HTMLCanvasElement>this.$refs.controlCanvas
    this.controlCanvasContext = this.controlCanvas.getContext( '2d' )
    this.controlCanvasContext.imageSmoothingEnabled = false
    this.controlCanvasLeft = this.controlCanvas.getBoundingClientRect().left
    this.controlCanvasTop = this.controlCanvas.getBoundingClientRect().top
    if ( this.sessionUserNickname ) {
      let user = (
        <IUser>this.$store.getters.GET_USER_BY_NICKNAME( this.nickname )
      )
      this.avatarImageViewport = user.avatarViewport
      if ( this.avatarImageViewport ) {
        this.showAvatarImage = true
      }
      this.showAvatar = true
    }

    this.loadImage()
    this.paint()
  }

  beforDestroy() {
    window.removeEventListener( 'keyup', this.keyupListner.bind( this ) )
  }

  private keyupListner( event: any ): void {
    if ( event.key == 'Enter' ) {
      if ( this.$refs.imageUrlInput == document.activeElement ) {
        this.setAvatarImageUrl()
      } else if ( this.$refs.nicknameInput == document.activeElement ) {
        this.submit()
      }
    }
  }

  loadImage() {
    this.avatarImage = new Image()
    this.avatarImage.onload = () => {
      this.imageCanvasContext.globalAlpha = 0.3
      let width = this.avatarImage.width
      let height = this.avatarImage.height
      this.avatarImage.setAttribute( 'crossorigin', 'anonymous' )
      if ( width > height ) {
        height = this.widgetWidth * height / width
        width = this.widgetWidth
        this.imageCanvasContext.drawImage( this.avatarImage, 0, ( this.widgetWidth - height ) / 2, width, height )
      } else {
        width = this.widgetWidth * width / height
        height = this.widgetWidth
        this.imageCanvasContext.drawImage( this.avatarImage, ( this.widgetWidth - width ) / 2, 0, width, height )
      }
      this.avatarIsLoaded = true
      this.errorUrlPlaceholderText = ''
      this.paint()
    }

    this.avatarImage.src = this.avatarImageUrl
    this.avatarImage.onerror = (error: any) => {
      if ( !this.avatarImageUrl ) {
        return
      }
      this.errorUrlPlaceholderText = 'Error: Bad URL!'
      this.avatarLoadError = true
      this.clearAvatarImage()
    }
  }

  paint() {
    this.imageCanvas.height = this.widgetWidth
    this.imageCanvasContext.fillStyle = '#666666'
    this.imageCanvasContext.fillRect( 0, 0, this.widgetWidth, this.widgetWidth )

    if ( !this.avatarIsLoaded ) {
      this.controlCanvas.height = this.widgetWidth
      return
    }

    this.imageCanvasContext.globalAlpha = 0.3
    let width = this.avatarImage.width
    let height = this.avatarImage.height
    if ( width > height ) {
      height = this.widgetWidth * height / width
      width = this.widgetWidth
      this.imageCanvasContext.drawImage( this.avatarImage, 0, ( this.widgetWidth - height ) / 2, width, height )
    } else {
      width = this.widgetWidth * width / height
      height = this.widgetWidth
      this.imageCanvasContext.drawImage( this.avatarImage, ( this.widgetWidth - width ) / 2, 0, width, height )
    }

    this.imageCanvasContext.globalAlpha = 1.0

    this.imageCanvasContext.beginPath()
    this.imageCanvasContext.arc(
      ( this.leftSelectionEdge + this.rightSelectionEdge ) / 2,
      ( this.bottomSelectionEdge + this.topSelectionEdge ) / 2,
      ( this.rightSelectionEdge - this.leftSelectionEdge ) / 2,
      0,
      Math.PI * 2
    )

    this.imageCanvasContext.clip()

    this.imageCanvasContext.fillStyle = 'gray'
    this.imageCanvasContext.fillRect(0, 0, this.widgetWidth, this.widgetWidth);

    if ( width > height ) {
      height = this.widgetWidth * height / width
      width = this.widgetWidth
      this.imageCanvasContext.drawImage( this.avatarImage, 0, ( this.widgetWidth - height ) / 2, width, height )
    } else {
      width = this.widgetWidth * width / height
      height = this.widgetWidth
      this.imageCanvasContext.drawImage( this.avatarImage, ( this.widgetWidth - width ) / 2, 0, width, height )
    }

    this.controlCanvas.height = this.widgetWidth

    this.controlCanvasContext.fillStyle = '#ffffff'
    this.controlCanvasContext.strokeStyle = 'black'
    this.controlCanvasContext.lineWidth = this.markerLineWidth
    const lineWidth05 = this.markerLineWidth / 2

    this.controlCanvasContext.fillRect(
      this.leftSelectionEdge,
      this.topSelectionEdge,
      this.markerSize,
      this.markerSize
    )
    this.controlCanvasContext.strokeRect(
      this.leftSelectionEdge + lineWidth05,
      this.topSelectionEdge + lineWidth05,
      this.markerSize - this.markerLineWidth,
      this.markerSize - this.markerLineWidth
    )

    this.controlCanvasContext.fillRect(
      this.rightSelectionEdge - this.markerSize,
      this.topSelectionEdge,
      this.markerSize,
      this.markerSize
    )
    this.controlCanvasContext.strokeRect(
      this.rightSelectionEdge - this.markerSize + lineWidth05,
      this.topSelectionEdge + lineWidth05,
      this.markerSize - this.markerLineWidth,
      this.markerSize - this.markerLineWidth
    )

    this.controlCanvasContext.fillRect(
      this.leftSelectionEdge,
      this.bottomSelectionEdge - this.markerSize,
      this.markerSize,
      this.markerSize
    )
    this.controlCanvasContext.strokeRect(
      this.leftSelectionEdge + lineWidth05,
      this.bottomSelectionEdge - this.markerSize + lineWidth05,
      this.markerSize - this.markerLineWidth,
      this.markerSize - this.markerLineWidth
    )

    this.controlCanvasContext.fillRect(
      this.rightSelectionEdge - this.markerSize,
      this.bottomSelectionEdge - this.markerSize,
      this.markerSize,
      this.markerSize
    )
    this.controlCanvasContext.strokeRect(
      this.rightSelectionEdge - this.markerSize + lineWidth05,
      this.bottomSelectionEdge - this.markerSize + lineWidth05,
      this.markerSize - this.markerLineWidth,
      this.markerSize - this.markerLineWidth
    )

    this.makeAvatar()
  }

  makeAvatar(): void {
    const viewportSize = this.rightSelectionEdge - this.leftSelectionEdge;
    const rate = this.avatarCanvasSize / viewportSize
    let width = this.avatarImage.width * rate
    let height = this.avatarImage.height * rate
    let x
    let y
    if ( width > height ) {
      height = this.widgetWidth * height / width
      width = this.widgetWidth
      x = 0
      y = ( this.widgetWidth - height ) / 2
    } else {
      width = this.widgetWidth * width / height
      height = this.widgetWidth
      x = ( this.widgetWidth - width ) / 2
      y = 0
    }
    const imageForAvatarWidth = width * rate
    const imageForAvatarHeight = height * rate
    const imageForAvatarX = - ( this.leftSelectionEdge - x ) * rate
    const imageForAvatarY = - ( this.topSelectionEdge - y ) * rate

    const avatarCanvasRadius = this.avatarCanvasSize / 2

    this.avatarImageViewport = {
      imageElement: this.avatarImage,
      imageForAvatarX,
      imageForAvatarY,
      imageForAvatarWidth,
      imageForAvatarHeight
    }
    this.showAvatar = true
    this.showAvatarImage = true
  }

  get nicknameInputed(): boolean {
    return !!this.nickname
  }

  get sessionUserNickname(): string {
    return this.$store.getters.GET_SESSION_USER_NICKNAME
  }

  submit(): void {
    if ( !this.nickname ) {
      return
    }

    if ( !this.sessionUserNickname && this.$store.getters.GET_NICKNAMES.includes(this.nickname) ) {
      this.errorNicknamePlaceholderText = 'This nickname is busy'
      this.nickname = ''
      return
    }

    let user = {
      nickname: this.nickname,
      avatarViewport: this.avatarImageViewport,
    }
    if ( !this.sessionUserNickname ) {
      this.$store.dispatch( 'ADD_USER', user )
      this.$store.dispatch( 'SET_SESSION_USER_NICKNAME', this.nickname )
      this.$router.push('chat')
    } else {
      this.$store.dispatch( 'UPDATE_USER', user )
      this.$router.push('chat')

    }
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// ----- Style theme -----
@import "./theme";

// ----- Dynamically linked classes -----
.inactiveButton {
  @extend %inactiveButton;
}
.nodisplay {
  display: none;
}
// ----- Static (DOM) linked classes -----
.loginnWidget {
  @extend %flexColumnEnvelope;
  justify-content: center;
  @extend %baseFont;
  .commonBorder {
    @extend %borderedBlock;
    .commonEnvelop {
      @extend %layoutBlock;
      padding: 0;
      .heder {
        @extend %heder;
      }
      .avatarImageBlock {
        @extend %controlBlock;
        position: relative;
        padding: 0;
        canvas {
          position: absolute;
          top: 0;
          left: 0;
        }
        // .imageCanvas {}
        // .controlCanvas {}
        .userIco {
          color: rgb(73, 73, 73);
          z-index: 20;
        }
      }
      .imageUrlInputBlock {
        @extend %inputBlock;
        .imageUrlRequestText {
          @extend %caption;
        }
        input {
          @extend %input;
          min-width: 40px;
          &::placeholder {
            @extend %errorTextPlaceholder;
          }
        }
      }
      .nameInputBlock {
        @extend %inputBlock;
        .nameRequestText {
          @extend %caption;
        }
        input {
          @extend %input;
          width: 100%;
          min-width: 40px;
          &::placeholder {
            @extend %errorTextPlaceholder;
          }
        }
        .clearNicknameButton {
          @extend %smallButton;
        }
      }
      .confirmBlock {
        @extend %controlBlock;
        padding: 20px 0;
        .avatarCanvas {
          z-index: 0;
        }
        .clearImageButton {
          @extend %bigButton;
        }
        .confirmButton {
          @extend %bigButton;
        }
      }
    }
  }
}
</style>
