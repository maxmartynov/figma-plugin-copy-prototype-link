<template>
  <div class="setup-component">
    <p>
      In order for this plugin to work, you will need to provide the file link
      (URL) below. You only have to do this once.
      <a @click.prevent="toggleInfo">
        Where do I find this?
      </a>
    </p>

    <p class="input-group">
      <label for="input">File link:</label>
      <input
        id="input"
        :class="{error: !inputValue || errorMsg}"
        v-model="inputValue"
        @keypress.enter="onClickOk"
      />
      <span class="error-hint" v-if="errorMsg">{{ errorMsg }}</span>
    </p>

    <p class="input-group">
      <label for="input">Scaling:</label>
      <select
        :value="scaling"
        @change="$emit('update:scaling', $event.target.value)"
      >
        <option
          v-for="value of SCALING_PARAMS"
          :key="value"
          :value="value"
          v-text="value"
        ></option>
      </select>
    </p>

    <p class="input-group">
      <label for="input">Hide UI:</label>
      <select
        :value="hideUI"
        @change="$emit('update:hideUI', Number($event.target.value))"
      >
        <option
          v-for="opt of HIDE_UI_OPTIONS"
          :key="opt.value"
          :value="opt.value"
          v-text="opt.text"
        ></option>
      </select>
    </p>

    <div class="info-block" :class="{open: isInfoOpen}">
      <p class="text">
        You can get the file link by opening the <b>Share</b> window and then
        clicking on <b>Copy link</b>
      </p>

      <div class="img-wrapper">
        <img src="../../../img/copy-link-screenshot.png" alt="Screenshot" />
      </div>

      <div class="buttons-block">
        <button @click="toggleInfo" tabindex="3">I've got it</button>
      </div>
    </div>

    <div class="buttons-block">
      <button @click="onClickOk" :disabled="!inputValue">Save</button>
    </div>

    <p class="text-small">
      The file URL is saved in your file safely. It’s not sent to any external
      server.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {ScalingParam} from '../../types/ScalingParam'
const REG_URL: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
const REG_URL_FIGMA: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(www)?[\.]?figma\.com(:[0-9]{1,5})?(\/.*)?$/i
const REG_URL_FILE_ID: RegExp = /\/?(file|proto)\/([a-zA-Z0-9]+)\/?/i

export default Vue.extend({
  name: 'SetupComponent',
  props: {
    fileId: {
      type: String,
      required: true,
    },
    scaling: {
      type: String,
      required: true,
    },
    hideUI: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isInfoOpen: false,
      errorMsg: '',
      inputValue: '',
      prototypeLink: '',
      SCALING_PARAMS: Object.keys(ScalingParam),
      HIDE_UI_OPTIONS: [
        {
          text: 'Yes',
          value: 1,
        },
        {
          text: 'No',
          value: 0,
        },
      ],
    }
  },
  mounted() {
    this.inputValue = this.fileId ? `figma.com/file/${this.fileId}` : ''
  },
  methods: {
    toggleInfo(): void {
      this.isInfoOpen = !this.isInfoOpen
    },
    execFileIdFromInput(): Promise<string> {
      return new Promise(
        (resolve: (id: string) => void, reject: (error: any) => void) => {
          let fileId: string = ''
          if (!this.inputValue) return resolve(fileId)
          if (REG_URL.test(this.inputValue)) {
            if (!REG_URL_FIGMA.test(this.inputValue)) {
              return reject('Used URL is not figma.com')
            }
            const res: string[] = REG_URL_FILE_ID.exec(this.inputValue)
            fileId = res && res[2]
          } else if (REG_URL_FILE_ID.test(this.inputValue)) {
            const res: string[] = REG_URL_FILE_ID.exec(this.inputValue)
            fileId = res && res[2]
          } else {
            fileId = new String(this.inputValue).replace(/\//g, '')
          }
          if (!fileId) {
            return reject('Could not extract the File Key from the string')
          }
          return resolve(fileId.trim())
        }
      )
    },
    async onClickOk(): Promise<void> {
      let fileId: string

      try {
        fileId = await this.execFileIdFromInput()
        this.errorMsg = ''
      } catch (err) {
        this.errorMsg = err
        return console.error(err)
      }

      this.$emit('save', {fileId, scaling: this.scaling, hideUI: this.hideUI})
    },
  },
})
</script>

<style>
.setup-component {
  text-align: left;
  display: inline-block;
  padding: 12px 16px;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.input-group {
  text-align: left;
  margin-top: 1em;
}
.input-group label {
  float: left;
  font-size: 1em;
  line-height: 1em;
}
.input-group input,
.input-group select {
  outline: none;
  border: 1px solid var(--clr-primary-lighten3);
  border-radius: 0;
  padding: 5px 12px;
  margin-top: 2px;
  width: 100%;
  height: 33px;
  font-size: 1em;
  color: var(--clr-primary-darken1);
  background: none;
}
.input-group input::placeholder {
  color: var(--clr-primary-lighten1);
}
.input-group input:hover {
  border-color: var(--clr-primary-lighten2);
}
.input-group input:focus {
  border-color: var(--clr-accent);
  box-shadow: inset 0 0 0 1px var(--clr-accent);
}
.input-group input.error {
  border-color: var(--clr-accent-secondary);
}
.input-group .error-hint {
  display: block;
  color: var(--clr-accent-secondary-darken1);
  font-size: 0.85em;
  line-height: 1.3em;
  padding: 0;
  height: 0px;
  overflow: visible;
  text-align: right;
}
.info-block {
  transition: right 0.2s;
  position: fixed;
  right: -100%;
  left: auto;
  top: 10px;
  bottom: auto;
  width: 100%;
  height: calc(100% - var(--footer-height));
  box-sizing: border-box;
  margin: auto 0;
  background: #fff;
  z-index: 5;
  padding: 0 16px;
}
.info-block.open {
  right: 0;
}
.info-block .text {
  overflow: hidden;
}
.info-block .text b {
  font-weight: normal;
  color: #000;
}
.info-block .img-wrapper {
  margin: 16px -16px 0;
  padding: 16px;
  background: #eff1f5;
  text-align: center;
}
.info-block .img-wrapper img {
  display: inline-block;
  width: 100%;
  position: relative;
}
.buttons-block {
  width: 100%;
}
.buttons-block button {
  display: inline-block;
  background: var(--clr-secondary);
  color: #fff;
  border: none;
  border-radius: 0;
  font-size: 1em;
  padding: 8px;
  width: 96px;
  height: 33px;
  margin: 16px 0;
  outline: none;
  cursor: pointer;
  letter-spacing: 0.1px;
}
.buttons-block button:hover {
  background: var(--clr-accent);
}
.buttons-block button:focus {
  box-shadow: 0 0 0 1px var(--clr-primary-lighten1);
  background: var(--clr-accent);
}
.buttons-block button[disabled='disabled'] {
  opacity: 0.5;
  cursor: auto;
  pointer-events: none;
}
</style>
