<template>
<div class="app">
  <div class="content" v-if="isShowContent">
    <p>
      In order for this plugin to work, you will need to provide the file
      link (URL) below. You only have to do this once.
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

    <div
      class="info-block"
      :class="{open: isInfoOpen}"
    >
      <p class="text">
        You can get the file link by opening the Share window
        and then clicking on <b>Copy link</b>
      </p>

      <div class="img-wrapper">
        <img
          src="../../img/copy-link-screenshot.png"
          alt="Screenshot"
        />
      </div>

      <div class="buttons-block">
        <button @click="toggleInfo" tabindex="3">I've got it</button>
      </div>
    </div>

    <div class="buttons-block">
      <button @click="onClickOk" :disabled="!inputValue">Save</button>
    </div>

    <p class="text-small">
      The file URL is saved in your file safely.
      It’s not sent to any external server.
    </p>

    <div class="footer">
      <div class="version">v{{ version }}</div>
    </div>
  </div>

  <textarea
    type="hidden"
    ref="hiddenInput"
    :value="prototypeLink"
    tabindex="-1"
  />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import packageJSON from '../../package.json'

const REG_URL: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
const REG_URL_FIGMA: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(www)?[\.]?figma\.com(:[0-9]{1,5})?(\/.*)?$/i
const REG_URL_FILE_ID: RegExp = /\/?(file|proto)\/([a-zA-Z0-9]+)\/?/i

interface NodeObj {
  id: string
  name: string
}

export default Vue.extend({
  name: 'App' as string,
  data() {
    return {
      isInfoOpen: false as boolean,
      isShowContent: true as boolean,
      errorMsg: '' as string,
      version: packageJSON.version as string,

      nodes: [] as NodeObj[],
      fileName: '' as string,
      fileId: '' as string,
      inputValue: '' as string,
      prototypeLink: '' as string
    }
  },
  created (): void {
    window.onmessage = (event: MessageEvent): void => {
      const msg: {act: string, fileId: string, nodes: NodeObj[], fileName: string} =
        event.data.pluginMessage

      this.nodes = msg.nodes
      this.fileId = msg.fileId
      this.fileName = msg.fileName
      this.inputValue = msg.fileId
        ? `figma.com/file/${msg.fileId}`
        : ''

      switch (msg.act as string) {
        case 'copy': {
          if (this.fileId) {
            this.onClickOk()
          } else {
            this.isShowContent = true
          }
          break
        }
        case 'setup': {
          this.isShowContent = true
          break
        }
      }
    }
  },
  methods: {
    toggleInfo (): void {
      this.isInfoOpen = !this.isInfoOpen
    },
    execFileIdFromInput (): Promise<string> {
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
      })
    },
    generatePrototypeLink (nodeId): string {
      const _nodeId: string = encodeURIComponent(nodeId)
      const _fileName: string = encodeURIComponent(this.fileName)

      const origin: string = 'https://www.figma.com'
      const pathname: string = `/proto/${this.fileId}/${_fileName}`
      const query: string = `node-id=${_nodeId}&scaling=min-zoom`
      return origin + pathname + '?' + query
    },
    copyToClipboard (str: string): Promise<void> {
      return new Promise((resolve) => setTimeout(() => {
        this.$refs.hiddenInput.select()
        document.execCommand('copy')
        window.getSelection().removeAllRanges()
        resolve()
      }))
    },
    async onClickOk (): Promise<void> {
      try {
        this.fileId = await this.execFileIdFromInput()
        this.errorMsg = ''
      } catch (err) {
        this.errorMsg = err
        return console.error(err)
      }

      const links = []
      for (const node of this.nodes) {
        const link = this.generatePrototypeLink(node.id)

        if (this.nodes.length === 1) {
          links.push(link)
        } else {
          links.push(`${node.name || 'Frame'} — ${link}`)
        }
      }
      this.prototypeLink = links.join('\n')

      parent.postMessage(
        {pluginMessage: {type: 'save-file-id', fileId: this.fileId}},
        '*'
      )

      await this.copyToClipboard(this.prototypeLink)
      parent.postMessage({pluginMessage: {type: 'link-copied'}}, '*')
    }
  }
})
</script>

<style>
:root {
  --clr-primary: rgb(27, 27, 27);
  --clr-primary-darken1: #000000;
  --clr-primary-lighten1: #787878;
  --clr-primary-lighten2: #afafaf;
  --clr-primary-lighten3: #d4d4d4;
  --clr-primary-lighten4: #f1f1f1;
  --clr-primary-lighten5: #f8f8f8;
  --clr-secondary: #18A0FB;
  --clr-accent: #3aacfb;
  --clr-accent-darken1: #1794e7;
  --clr-accent-lighten2: #dce3e9;
  --clr-accent-secondary: #dc78a5;
  --clr-accent-secondary-darken1: #ad2863;

  --footer-height: 32px;
}

html,
body,
.app {
  height: 100%;
}

body {
  font-family: "Roboto", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--clr-primary-lighten1);
  font-size: 12px;
  line-height: 1.4em;
  margin: 0;
}

.content {
  text-align: left;
  display: inline-block;
  padding: 12px 16px;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

a {
  cursor: pointer;
  color: var(--clr-accent);
}
a:hover {
  color: var(--clr-accent-darken1);
  text-decoration: underline;
}

p {
  margin: 0;
  color: var(--clr-primary-lighten1);
}

.text-small {
  font-size: 0.84em;
  line-height: 1.4em;
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
.input-group input {
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
  font-size: .85em;
  line-height: 1.3em;
  padding: 0;
  height: 0px;
  overflow: visible;
  text-align: right;
}



.info-block {
  transition: right .2s;
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
.buttons-block button[disabled="disabled"] {
  opacity: .5;
  cursor: auto;
  pointer-events: none;
}



.footer {
  border-top: 1px solid #e8efea;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--footer-height);
  z-index: 7;
}
.footer .version {
  padding-left: 12px;
  font-weight: 500;
  font-size: 10px;
  line-height: var(--footer-height);
}

textarea[type="hidden"] {
  opacity: 0;
  position: absolute;
  bottom: 0;
  left: -100%;
}
</style>