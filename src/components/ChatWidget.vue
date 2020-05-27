/* eslint-disable prettier/prettier */
<template>
  <div class="chatWidget">
    <div class="commonBorder" :style="{width: (widgetWidth + 4) + 'px'}">
      <div class="commonEnvelop" :style="{width: widgetWidth + 'px'}">
        <div
          class="heder"
          :style="{width: widgetWidth + 'px'}"
        >{{nickname + (!correspondentNickname ? '' : (' - ' + correspondentNickname))}}</div>
        <div class="layoutsEnvelop"
        >
          <div class="contactLayout"
          >
            <div
              class="contactWidgetLayout"
              :style="{width: (wideMode ? wideModeContactSizeWidth : narrowModeContactSizeWidth) + 'px'}"
            >
              <table>
                <tr
                  v-for="nickname_ in nicknames"
                  :key="nickname_"
                >
                  <td>
                    <ContactWidget
                      :contactSizeWidth="ContactSizeWidth"
                      :wideMode="wideMode"
                      :nickname="nickname_"
                      :isSelected="nickname_ == correspondentNickname"
                      @setSelectedNickname="onSetSelectedNickname"
                    />
                  </td>
                </tr>
              </table>
            </div>
            <div class="buttonsEnvelope">
              <div
                class="buttonDiv"
                @click="showSettungs"
                v-if="wideMode"
              >
                <div
                  class="svgEnvelope"
                  v-if="!propNickname"
                  title="Change avatar or relogin with a new username"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div
                  class="svgEnvelope"
                  v-if="!!propNickname"
                  title="Select new owner User"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
              <div
                class="buttonDiv"
                :class="{inactive: !messageText}"
                @click="sendMessage"
                title="Send [Ctrl+Enter]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
               </div>
            </div>
          </div>
          <div class="toggleWideModeLayout">
            <div class="toggleWideModeButtonEnvelope">
              <div class="toggleWideModeButton" @click="toggleWideMode">
                <svg
                  v-if="wideMode"
                  style="position: absolute; top: 0; left: 0;"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="10 13 4 8 10 3" />
                </svg>
                <svg
                  v-if="!wideMode"
                  style="position: absolute; top: 0; left: 0;"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 13 12 8 6 3" />
                </svg>
              </div>
            </div>
          </div>
          <div
            class="messageLayout"
            :style="{width: (wideMode ? wideModeMessagesSizeWidth : narrowModeMessagesSizeWidth) + 'px'}"
          >
            <div class="correspondenceWidgetEnvelope" ref="correspondenceWidgetEnvelope">
              <CorrespondenceWidget
                :watcherNickname="nickname"
                :correspondentNickname="correspondentNickname"
              />
              <div  class="correspondenceWidgetBottom"></div>
            </div>
            <div
              class="textareaEnvelope"
              v-if="correspondenceSelected"
            >
              <textarea
                v-model="messageText"
                spellcheck="true"
                ref="textarea"
                rows="5"
                placeholder="Enter your message here"
                :style="{width: ((wideMode ? wideModeMessagesSizeWidth : narrowModeMessagesSizeWidth) - 7) + 'px'}"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popupEnvelope">
      <div
        v-if="requestShow"
        class="popup"
        ref="request"
        @click="requestConfirm"
      >Select new owner User</div>
      <div
        v-if="okShow"
        class="popup"
        ref="ok"
        @click="okConfirm"
      >OK</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

// importing interfaces:
/* eslint-disable no-unused-vars */
import ISelectedNicknamePayload from './ISelectedNicknamePayload'
import IMessage from './IMessage'
import IScrollableElement from './IScrollableElement'
/* eslint-enable no-unused-vars */

import ContactWidget from './ContactWiget.vue'
import CorrespondenceWidget from './CorrespondenceWidget.vue'

@Component( {
  components: {
    ContactWidget,
    CorrespondenceWidget,
  },
} )
export default class ChatWidget extends Vue {
  @Prop() private propNickname?: string

  private widgetWidth = 396
  private widgetWidthMax = 700

  private narrowModeContactSizeWidth = 70
  private wideModeContactSizeWidth = 190
  private narrowModeMessagesSizeWidth = this.widgetWidth - this.narrowModeContactSizeWidth - 4 // 312
  private wideModeMessagesSizeWidth = this.widgetWidth - this.wideModeContactSizeWidth - 4
  private wideMode = true

  get ContactSizeWidth(): number {
    return this.wideMode ? this.wideModeContactSizeWidth : this.narrowModeContactSizeWidth
  }

  private correspondentNickname: string = null
  private messageText: string = null
  private correspondenceSelected = false
  private detachedWatcherNickname: string = null
  private detachedWatcherNicknameSelectionMode = false
  private requestShow = false
  private okShow = false

  mounted() {
    window.addEventListener( 'keyup', this.keyupListner.bind( this ) )
    window.addEventListener( 'resize', this.getWidgetWidth.bind( this ) )
    this.getWidgetWidth()
  }

  beforDestroy() {
    window.removeEventListener( 'keyup', this.keyupListner.bind( this ) )
    window.removeEventListener( 'resize', this.getWidgetWidth.bind( this ) )
  }

  private keyupListner( event: any ): void {
    if ( event.key == 'Enter' && event.ctrlKey ) {
      if ( this.$refs.textarea == document.activeElement ) {
        this.sendMessage()
      }
    }
  }

  getWidgetWidth(): void {
    this.widgetWidth = Math.min(
      this.widgetWidthMax,
      document.body.clientWidth / 2 - 40
    )
    this.narrowModeMessagesSizeWidth = this.widgetWidth - this.narrowModeContactSizeWidth - 4 // 312
    this.wideModeMessagesSizeWidth = this.widgetWidth - this.wideModeContactSizeWidth - 4
  }

  private toggleWideMode(): void {
    this.wideMode = !this.wideMode
  }

  get nickname(): string {
    if ( this.detachedWatcherNickname ) {
      return this.detachedWatcherNickname
    }
    if ( this.propNickname ) {
      return this.propNickname
    }
    return this.$store.getters.GET_SESSION_USER_NICKNAME
  }

  get nicknames(): string[] {
    return this.$store.getters.GET_NICKNAMES
  }

  onSetSelectedNickname( payload: ISelectedNicknamePayload ): void {
    const nickname = payload.selectedNickname
    if ( !this.detachedWatcherNicknameSelectionMode ) {
      this.correspondentNickname = nickname
      this.correspondenceSelected = !!this.correspondentNickname && !!this.nickname
    } else {
      this.detachedWatcherNickname = nickname
      this.detachedWatcherNicknameSelectionMode = false
      this.okShow = true
    }
  }

  async sendMessage(): Promise<void> {
    if ( !this.messageText ) {
      return
    }
    const correspondent = this.$store.getters.GET_USER_BY_NICKNAME( this.correspondentNickname )
    const autor = this.$store.getters.GET_USER_BY_NICKNAME( this.nickname )
    const message: IMessage = {
      authorNickname: autor.nickname,
      correspondentNickname: correspondent.nickname,
      timestamp: new Date().getTime(),
      messageText: this.messageText,
    }

    this.$store.dispatch( 'ADD_MESSAGE', message )

    this.messageText = '';

    (<HTMLInputElement>this.$refs.textarea).focus()

    await this.$nextTick()

    const correspondenceWidgetEnvelopeElement = <IScrollableElement>this.$refs.correspondenceWidgetEnvelope
    correspondenceWidgetEnvelopeElement.scrollTop = correspondenceWidgetEnvelopeElement.scrollHeight;
  }

  showSettungs(): void {
    if ( !this.propNickname ) {
      this.$router.push( 'login' )
    } else {
      this.detachedWatcherNicknameSelectionMode = true
      this.requestShow = true
    }
  }

  requestConfirm(): void {
    this.requestShow = false
  }

  okConfirm(): void {
    this.okShow = false
    this.requestShow = false
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="true" lang="scss">
@import "./theme";

// ----- Common declaration -----
$toggleWideModeButtonSize: 16px;
// ----- Static (DOM) linked classes -----
.chatWidget {
  @extend %flexColumnEnvelope;
  justify-content: center;
  @extend %baseFont;
  position: relative;
  .commonBorder {
    @extend %borderedBlock;
    @extend %layoutBlock;
    .commonEnvelop {
      @extend %layoutBlock;
      padding: 0;
      .heder {
        @extend %heder;
      }
      .layoutsEnvelop {
        // @extend %flexRowTopControlBlock;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0;
        justify-content: stretch;
        height: 90vh;
        min-height: 300px;
        max-height: 700px;
        .contactLayout {
          @extend %borderedBlock;
          @extend %flexColumnEnvelope;
          justify-content: space-between;
          height: 100%;
          background-color: $backgroundHalfColor;
          .contactWidgetLayout {
            @extend %scrollbar;
            padding: 0;
            table {
              border-collapse: collapse;
              padding: 0;
              // border-spacing: 0;
              // border: none;
              tr {
                // border: none;
                // border-style: hidden;
                padding: 0;
                td {
                  // border: none;
                  // border-style: hidden;
                  // @extend %borderedBlock;
                  padding: 0;
                }
              }
            }
          }
        }
        .buttonsEnvelope {
          @extend %flexRowEnvelope;
          justify-content: space-evenly;
            width: 48px;
          @extend %borderedBlock;
          padding: 5px 0;
          width: 100%;
          height: 58px;
          background-color: $backgroundColorActive;
          .buttonDiv {
            @extend %flexRowControlBlock;
            @extend %control;
            justify-content: space-evenly;
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 24px;
            box-shadow: $controlShadow;
            background-color: $backgroundColorActive;
            .svgEnvelope {
              @extend %flexRowEnvelope;
            }
          }
        }
        .toggleWideModeLayout {
          // border: 1px solid red;
          padding: 0;
          height: 100%;
          position: relative;
          .toggleWideModeButtonEnvelope {
            position: absolute;
            left: 50%;
            top: 50%;
            padding: 0;
            .toggleWideModeButton {
              @extend %control;
              position: absolute;
              width: $toggleWideModeButtonSize;
              height: $toggleWideModeButtonSize;
              left: -($toggleWideModeButtonSize/2);
              top: -($toggleWideModeButtonSize/2);
              padding: 0;
              // border: 1px solid red;
              border-radius: 50%;
              background-color: $headerBackgroundColor;
              color: $headerColor;
              z-index: 10;
            }
          }
        }
        .messageLayout {
          @extend %borderedBlock;
          @extend %flexColumnEnvelope;
          justify-content: space-between;
          height: 100%;
          padding: 0;
          background-color: $backgroundHalfColor;
          // border: 1px solid red;
          .correspondenceWidgetEnvelope {
            @extend %scrollbar;
            width: 100%;
            .correspondenceWidgetBottom {
              width: 90%;
              height: 80px;
              // border: 1px solid red !important;
            }
          }
          .textareaEnvelope {
            width: 100%;
            // position: relative;
            padding: 0;
            textarea {
              @extend %scrollbar;
              @extend %input;
              // position: absolute;
              // left: 0px;
              // bottom: 0;
              resize: none;
            }
            textarea::placeholder {
              color: $placeholderColor;
              font-style: italic;
            }
          }
        }
      }
    }
  }
  .popupEnvelope {
    position: absolute;
    top: 50%;
    left: 50%;
    .popup{
      position: absolute;
      top: -40px;
      left: -150px;
      width: 300px;
      height: 80px;
      color: black;
      border: 2px solid $borderColor;
      background-color: white;
      @extend %flexRowContainer;
      justify-content: center;
      z-index: 20;
      border-radius: 15px;
    }
  }
}
</style>
