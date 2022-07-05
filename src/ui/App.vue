<template>
  <div class="app">
    <component
      v-if="contentComponent"
      :is="contentComponent"
      :fileId="fileId"
      :scaling.sync="scaling"
      @save="onSave"
    />

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
import {NodeObj} from '../types/NodeObj'
import {ScalingParam} from '../types/ScalingParam'
import {ConfigParams} from '../types/ConfigParams'
import {PluginActions} from '../types/PluginActions'
import AboutComponent from './components/About.component.vue'
import SetupComponent from './components/Setup.component.vue'

interface ComponentData {
  contentComponent?: Vue
  nodes: NodeObj[]
  fileName: string
  fileId: string
  scaling: ScalingParam
  prototypeLink: string
}
const DEFAULT_SCALING = ScalingParam['min-zoom']

export default Vue.extend({
  name: 'App',
  components: {
    AboutComponent,
    SetupComponent,
  },
  data(): ComponentData {
    return {
      contentComponent: null,
      nodes: [],
      fileName: '',
      fileId: '',
      scaling: DEFAULT_SCALING,
      prototypeLink: '',
    }
  },
  created(): void {
    window.onmessage = (event: MessageEvent): void => {
      const msg: {
        act: PluginActions
        fileId: string
        scaling: ScalingParam
        nodes: NodeObj[]
        fileName: string
      } = event.data.pluginMessage

      this.nodes = msg.nodes
      this.fileId = msg.fileId
      this.scaling = msg.scaling || DEFAULT_SCALING
      this.fileName = msg.fileName

      switch (msg.act) {
        case PluginActions.copy: {
          if (this.fileId) {
            this.copyLink()
          } else {
            this.contentComponent = SetupComponent
          }
          break
        }
        case PluginActions.setup: {
          this.contentComponent = SetupComponent
          break
        }
        case PluginActions.about: {
          this.contentComponent = AboutComponent
          break
        }
      }
    }
  },
  methods: {
    generatePrototypeLink(nodeId: string): string {
      const _fileName: string = encodeURIComponent(this.fileName)
      const origin: string = 'https://www.figma.com'
      const pathname: string = `/proto/${this.fileId}/${_fileName}`
      const query: string = toQueryString({
        'node-id': nodeId,
        scaling: this.scaling || DEFAULT_SCALING,
      })
      return origin + pathname + '?' + query
    },
    async copyLink(): Promise<void> {
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

      await this._copyToClipboard()
      parent.postMessage({pluginMessage: {type: 'links-copied'}}, '*')
    },
    onSave(payload: ConfigParams) {
      this.fileId = payload.fileId
      this.scaling = payload.scaling
      parent.postMessage({pluginMessage: {type: 'save-config', payload}}, '*')
      parent.postMessage(
        {
          pluginMessage: {
            type: 'message',
            message: `Saved. File key: ${this.fileId}`,
          },
        },
        '*'
      )
      this.close()
    },
    close() {
      parent.postMessage({pluginMessage: {type: 'cancel'}}, '*')
    },
    _copyToClipboard(): Promise<void> {
      return new Promise((resolve) =>
        setTimeout(() => {
          this.$refs.hiddenInput?.select()
          document.execCommand('copy')
          window.getSelection().removeAllRanges()
          resolve()
        })
      )
    },
  },
})

function toQueryString(obj: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) return
    if (Array.isArray(obj[key])) {
      searchParams.append(key, obj[key].join(','))
    } else {
      searchParams.append(key, obj[key])
    }
  })
  return searchParams.toString()
}
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
  --clr-secondary: #18a0fb;
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
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--clr-primary-lighten1);
  font-size: 12px;
  line-height: 1.4em;
  margin: 0;
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

textarea[type='hidden'] {
  opacity: 0;
  position: absolute;
  bottom: 0;
  left: -100%;
}
</style>