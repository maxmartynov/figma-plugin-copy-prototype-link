<template>
<div class="app">
  <div class="content" v-if="isShowContentt">
    <img
      src="../../img/icon.png"
      width="40px"
      alt="Logo"
    />

    <h2>Settings</h2>

    <p class="input-group">
      <label for="input">File Key:</label>
      <input
        id="input"
        :class="{error: !inputValue}"
        v-model="inputValue"
        @keypress.enter="onClickOk"
      />
      <a
        class="info-btn"
        @click.prevent="toggleInfo"
      >
        Information
      </a>
    </p>

    <p
      class="info-block"
      :class="{open: isInfoOpen}"
    >
      <span class="text">
        This plugin requires the <b>File Key</b> to build the prototype link.
        <br/>
        <br/>
        Copy the whole <b>File URL</b> from the browser's address bar and
        paste it to the input field and the plugin will extract
        the <b>File Key</b> automatically. You also can paste only
        the <b>File Key</b> to the input field.
        <br/>
        <br/>
        The <b>File Key</b> looks like:
        <code>https://figma.com/file/<b>e9z7p5lisUPmR</b>/File</code>
      </span>

      <a v-if="isInfoOpen" @click="toggleInfo"><b>Got it</b></a>
    </p>

    <div class="buttons-block">
      <button @click="onClickOk" :disabled="!inputValue">Save</button>
      <button @click="onClickCancel">Cancel</button>
    </div>
  </div>

  <input
    type="hidden"
    ref="hiddenInput"
    :value="prototypeLink"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

const REG_URL: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
const REG_URL_FIGMA: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(www)?[\.]?figma\.com(:[0-9]{1,5})?(\/.*)?$/gm
const REG_URL_FILE_ID: RegExp = /\/?(file|proto)\/([a-zA-Z0-9]+)\/?/gm

export default Vue.extend({
  name: 'App' as string,
  data() {
    return {
      isInfoOpen: false as boolean,
      isShowContentt: true as boolean,
      nodeId: '' as string,
      fileName: '' as string,
      fileId: '' as string,
      inputValue: '' as string,
      prototypeLink: '' as string
    }
  },
  created (): void {
    window.onmessage = (event: MessageEvent): void => {
      const msg: {act: string, fileId: string, nodeId: string, fileName: string} =
        event.data.pluginMessage

      this.nodeId = msg.nodeId
      this.fileId = msg.fileId
      this.fileName = msg.fileName
      this.inputValue = msg.fileId || ''

      switch (msg.act as string) {
        case 'copy': {
          if (this.fileId) {
            this.onClickOk()
          } else {
            this.isInfoOpen = true
            this.isShowContentt = true
          }
          break
        }
        case 'setup': {
          if (!this.fileId) {
            this.isInfoOpen = true
          }
          this.isShowContentt = true
          break
        }
      }
    }
  },
  methods: {
    toggleInfo (): void {
      this.isInfoOpen = !this.isInfoOpen
    },
    execFileIdFromInput (): string {
      let fileId: string = ''

      if (!this.inputValue) return fileId

      if (REG_URL.test(this.inputValue)) {
        if (!REG_URL_FIGMA.test(this.inputValue)) {
          throw new Error('Used URL is not figma.com')
        }

        const res: string[] = REG_URL_FILE_ID.exec(this.inputValue)
        fileId = res && res[2]
      } else if (REG_URL_FILE_ID.test(this.inputValue)) {
        const res: string[] = REG_URL_FILE_ID.exec(this.inputValue)
        fileId = res && res[2]
      } else {
        fileId = this.inputValue.replace(/\//g, '')
      }

      return fileId
    },
    generatePrototypeLink (): string {
      const _nodeId: string = encodeURIComponent(this.nodeId)
      const _fileName: string = encodeURIComponent(this.fileName)

      const origin: string = 'https://www.figma.com'
      const pathname: string = `/proto/${this.fileId}/${_fileName}`
      const query: string = `node-id=${_nodeId}&scaling=min-zoom`
      return origin + pathname + '?' + query
    },
    copyToClipboard (str: string): Promise<void> {
      this.$refs.hiddenInput.setAttribute('type', 'text')

      return new Promise((resolve) => setTimeout(() => {
        this.$refs.hiddenInput.select()
        document.execCommand('copy')
        this.$refs.hiddenInput.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
        resolve()
      }))
    },
    async onClickOk (): Promise<void> {
      this.fileId = this.execFileIdFromInput()
      this.prototypeLink = this.generatePrototypeLink()

      parent.postMessage(
        {pluginMessage: {type: 'save-file-id', fileId: this.fileId}},
        '*'
      )

      await this.copyToClipboard(this.prototypeLink)
      parent.postMessage({pluginMessage: {type: 'link-copied'}}, '*')
    },
    onClickCancel (): void {
      parent.postMessage({pluginMessage: {type: 'cancel'}}, '*')
    }
  }
})
</script>

<style>
:root {
  --clr-primary: rgb(27, 27, 27);
  --clr-primary-darken1: #000000;
  --clr-primary-lighten1: #d0d0d0;
  --clr-primary-lighten2: #ececec;
  --clr-primary-lighten3: #f1f1f1;
  --clr-primary-lighten4: #f8f8f8;
  --clr-secondary: #ccc;
  --clr-accent: #18a0fb;
  --clr-accent-darken1: #1794e7;
  --clr-accent-lighten2: #dce3e9;
  --clr-accent-secondary: #dc78a5;
  --clr-accent-secondary-darken1: #ad2863;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 13px;
  margin: 0;
}

.content {
  text-align: center;
  display: inline-block;
  padding: 10px;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

h2 {
  margin: 0 0 25px;
  color: var(--clr-primary-darken1);
  letter-spacing: 0.4px;
}

a {
  cursor: pointer;
}
a:hover {
  color: var(--clr-accent-darken1);
  text-decoration: underline;
}



.input-group {
  text-align: left;
  padding: 0 20px;
  margin-top: 10px;
}
.input-group label {
  color: var(--clr-primary-darken1);
}
.input-group input {
  outline: none;
  border: 1px solid var(--clr-primary-lighten1);
  border-radius: 5px;
  padding: 5px;
  margin-top: 2px;
  width: 100%;
  height: 30px;
  font-size: .9em;
}
.input-group input:hover {
  box-shadow: inset 0 0 0 1px var(--clr-accent-lighten2);
}
.input-group input.error {
  box-shadow: inset 0 0 0 1px var(--clr-accent-secondary) !important;
}
.input-group .info-btn {
  display: block;
  float: right;
  margin-top: 5px;
  padding: 0 0 5px 5px;
  text-decoration: underline;
  letter-spacing: 0.2px;
  cursor: help;
}



.info-block {
  text-align: center;
  transition: right .2s;
  position: fixed;
  right: -100%;
  left: auto;
  top: 10px;
  bottom: auto;
  width: calc(100% - 10px * 2);
  box-sizing: border-box;
  margin: auto 0;
  background: #fff;
  z-index: 5;
}
.info-block.open {
  right: 10px;
}
.info-block .text {
  background: var(--clr-primary-lighten3);
  color: var(--clr-primary-darken1);
  text-align: left;
  border-radius: 5px;
  display: block;
  padding: 8px 8px 12px;
  overflow: hidden;
}
.info-block .text code {
  color: var(--clr-accent-secondary-darken1);
  font-size: .77em;
  margin-top: 5px;
}
.info-block .text code b {
  font-size: 1.5em;
}
.info-block a {
  display: block;
  font-size: 1.2em;
  margin-top: 5px;
  padding: 10px;
}



.buttons-block {
  padding: 5px 0;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 35px;
  width: 100%;
}
.buttons-block button {
  display: inline-block;
  border-radius: 5px;
  background: white;
  color: var(--clr-primary);
  border: none;
  font-size: .9em;
  padding: 8px;
  width: 85px;
  height: 30px;
  margin: 0 5px;
  box-shadow: inset 0 0 0 1px var(--clr-primary);
  outline: none;
  cursor: pointer;
  letter-spacing: 0.1px;
}
.buttons-block button:hover {
  border-radius: 5px;
  background: var(--clr-primary-lighten4);
  color: var(--clr-primary-darken1);
}
.buttons-block button[disabled="disabled"] {
  opacity: .5;
  cursor: auto;
  background: none;
}


.buttons-block button:focus,
.input-group input:focus {
  box-shadow: inset 0 0 0 2px var(--clr-accent);
  background: var(--clr-primary-lighten4);
}
</style>