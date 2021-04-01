<template>
<div class="app">
  <div class="content" v-if="isShowContent">
    <div class="logo-wrapper">
      <img class="logo" src="../../img/icon.png" />
    </div>

    <h3 class="text-center" style="color: #000;">
      Prototype Quick Link
    </h3>

    <p class="text-center">
      Copy the prototype link for a selected frame with a single click
    </p>

    <div class="text-center" style="padding-top: 23px;">
      <h3>Credits</h3>

      <div>
        The idea initiator & artwork
        <br/>
        <a href="https://www.protogeridis.com" target="_blank">
          Filippos Protogeridis
        </a>
      </div>
      <br/>
      <div>
        Developer
        <br/>
        <a href="https://maxmartynov.com/" target="_blank">
          Max Martynov
        </a>
      </div>
    </div>


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

interface NodeObj {
  id: string
  name: string
}

interface ComponentData {
  isShowContent: boolean
  version: string
  nodes: NodeObj[]
  fileName: string
  fileId: string
  prototypeLink: string
}

export default Vue.extend({
  name: 'App',
  data (): ComponentData {
    return {
      isShowContent: true,
      version: packageJSON.version,
      nodes: [],
      fileName: '',
      fileId: '',
      prototypeLink: '',
    }
  },
  created (): void {
    window.onmessage = (event: MessageEvent): void => {
      const msg: {
        act: 'setup'|'copy',
        fileId: string,
        nodes: NodeObj[],
        fileName: string
      } = event.data.pluginMessage

      this.nodes = msg.nodes
      this.fileId = msg.fileId
      this.fileName = msg.fileName

      switch (msg.act) {
        case 'copy': {
          if (this.fileId) {
            this.copyLink()
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
    generatePrototypeLink (nodeId: string): string {
      const _nodeId: string = encodeURIComponent(nodeId)
      const _fileName: string = encodeURIComponent(this.fileName)

      const origin: string = 'https://www.figma.com'
      const pathname: string = `/proto/${this.fileId}/${_fileName}`
      const query: string = `node-id=${_nodeId}&scaling=min-zoom`
      return origin + pathname + '?' + query
    },
    copyToClipboard (): Promise<void> {
      return new Promise((resolve) => setTimeout(() => {
        this.$refs.hiddenInput.select()
        document.execCommand('copy')
        window.getSelection().removeAllRanges()
        resolve()
      }))
    },
    async copyLink (): Promise<void> {
      const links = []
      console.log('this.nodes: ', this.nodes)
      for (const node of this.nodes) {
        const link = this.generatePrototypeLink(node.id)

        if (this.nodes.length === 1) {
          links.push(link)
        } else {
          links.push(`${node.name || 'Frame'} — ${link}`)
        }
      }
      this.prototypeLink = links.join('\n')

      await this.copyToClipboard()
      parent.postMessage({pluginMessage: {type: 'links-copied'}}, '*')
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

  --footer-height: 20px;
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
.content .logo-wrapper {
  text-align: center;
}
.content .logo-wrapper .logo {
  display: inline-block;
  width: 60px;
  height: 60px;
  margin: 15px 0;
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
.text-center {
  text-align: center;
}


.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--footer-height);
  z-index: 7;
  text-align: right;
}
.footer .version {
  padding: 0 5px;
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