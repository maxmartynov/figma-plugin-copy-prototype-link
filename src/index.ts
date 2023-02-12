import {ConfigParams} from './types/ConfigParams'
import {NodeObj} from './types/NodeObj'
import {PluginActionEvent} from './types/PluginActionEvent'
import {PluginActions} from './types/PluginActions'
import {PluginMessage} from './types/PluginMessage'
import {ScalingParam} from './types/ScalingParam'

const currentPage: PageNode = figma.currentPage
const selectedItems: ReadonlyArray<SceneNode> = currentPage.selection
const root: DocumentNode = figma.root

main()

function main(): void {
  figma.ui.onmessage = onPluginMessage

  switch (figma.command as string) {
    case 'copyPrototypeLink': {
      return openWindow(PluginActions.copy)
    }
    case 'settings': {
      return openWindow(PluginActions.setup)
    }
    case 'about': {
      return openWindow(PluginActions.about)
    }
  }

  figma.closePlugin('ERROR: Unknown command')
}

function openWindow(action: PluginActions): void {
  const configParams: ConfigParams = getPluginConfig()
  const nodes: NodeObj[] = convertNodesToJSON(findItemsForLink())

  if (!nodes || !nodes.length) {
    return figma.closePlugin('ERROR: Could not get the link item')
  }

  if (!configParams.fileId && action === PluginActions.copy) {
    action = PluginActions.setup
  }

  const pluginAction: PluginActionEvent = {
    action,
    nodes,
    configParams,
    fileName: root.name,
  }

  switch (action as string) {
    case PluginActions.setup: {
      figma.showUI(__html__, {
        width: 295,
        height: 350,
      })

      callPluginAction(pluginAction)
      break
    }
    case PluginActions.about: {
      figma.showUI(__html__, {
        width: 320,
        height: 480,
      })

      callPluginAction(pluginAction)
      break
    }
    case PluginActions.copy: {
      figma.showUI(__html__, {
        width: 0,
        height: 0,
      })

      callPluginAction(pluginAction)
      break
    }
  }
}

function onPluginMessage(msg: PluginMessage) {
  const nodes: NodeObj[] = convertNodesToJSON(findItemsForLink())

  if (msg.type === 'message' && msg.message) {
    figma.notify(msg.message || '')
    return
  } else if (msg.type === 'cancel') {
    figma.closePlugin()
    return
  } else if (msg.type === 'save-config') {
    savePluginConfig(msg.payload)
    return
  } else if (msg.type === 'links-copied') {
    let msg: string

    if (!nodes.length) {
      msg = 'There are no nodes selected to generate the link'
    } else if (nodes.length === 1) {
      const nodeName = (nodes[0]?.name || '').trim()

      if (nodeName) {
        msg = `Prototype link of '${nodeName}' copied to clipboard`
      } else {
        msg = 'Prototype link copied to clipboard'
      }
    } else {
      msg = `Prototype links copied to clipboard (${nodes.length})`
    }

    figma.closePlugin(msg)
    return
  }

  figma.closePlugin()
}

function callPluginAction(pluginEvent: PluginActionEvent): void {
  figma.ui.postMessage(pluginEvent, {origin: '*'})
}

function getPluginConfig(): ConfigParams {
  // INFO: Private plugin method
  // Only if you are making a private plugin (publishing it internally to your
  // company that is on an Organization plan) you can get the file key
  // const fileId: string = figma.fileKey

  const configParams: ConfigParams = {
    fileId: '',
    scaling: undefined,
    hideUI: undefined,
  }

  configParams.fileId = root.getPluginData('config.fileId')
  configParams.scaling = root.getPluginData(
    'config.scaling'
  ) as ConfigParams['scaling']
  configParams.hideUI =
    (Number(root.getPluginData('config.hideUI')) as ConfigParams['hideUI']) || 0

  // backward compatibility
  if (!configParams.fileId) {
    const oldVal = root.getPluginData('shareFileId')
    if (oldVal) {
      configParams.fileId = oldVal
      root.setPluginData('shareFileId', '')
    }
  }

  // backward compatibility
  if (!configParams.scaling) {
    const oldVal = root.getPluginData('urlQueryParamScaling')
    if (oldVal) {
      configParams.scaling = oldVal as ScalingParam
      root.setPluginData('urlQueryParamScaling', '')
    }
  }

  return configParams
}
function savePluginConfig(config: ConfigParams) {
  root.setPluginData('config.fileId', config.fileId)
  root.setPluginData('config.scaling', config.scaling || '')
  root.setPluginData('config.hideUI', String(config.hideUI || 0))
}

function findItemsForLink(): Array<PageNode | SceneNode | BaseNode> {
  let linkItems: Array<PageNode | SceneNode | BaseNode> = []

  if (!selectedItems.length) {
    linkItems.push(figma.currentPage)
  } else {
    for (const selectedItem of selectedItems) {
      const parents: Map<string, SceneNode | BaseNode> =
        getParentsList(selectedItem)
      const keys: string[] = Array.from(parents.keys())

      for (let i = keys.length - 1; i >= 0; i--) {
        const id: string = keys[i]
        const item: SceneNode | BaseNode = parents.get(id)
        const prev_id: string = keys[i - 1]
        const prev_item: SceneNode | BaseNode = parents.get(prev_id)

        if (item.type !== 'PAGE') continue

        if (prev_item && prev_item.type === 'FRAME') linkItems.push(prev_item)
        else linkItems.push(item)
        break
      }
    }
  }

  return uniqueBy(
    linkItems.filter((n) => n),
    'id'
  )
}

function getParentsList(
  node: SceneNode | BaseNode
): Map<string, SceneNode | BaseNode> {
  const map: Map<string, SceneNode | BaseNode> = new Map()

  if (!node) return map

  let _parent: SceneNode | BaseNode | undefined = node

  while (_parent) {
    map.set(_parent.id, _parent)
    _parent = _parent.id === root.id ? undefined : _parent.parent
  }

  return map
}

function convertNodesToJSON(
  nodes: Array<PageNode | SceneNode | BaseNode>
): NodeObj[] {
  return nodes.map((node) => ({
    id: node.id,
    name: node.name,
  }))
}

function uniqueBy(arr: any[], key: string): any[] {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}
