import {PluginActions} from './types/PluginActions'
import {PluginMessage} from './types/PluginMessage'

const currentPage: PageNode = figma.currentPage
const selectedItems: ReadonlyArray<SceneNode> = currentPage.selection
const root: DocumentNode = figma.root

interface NodeObj {
  id: string
  name: string
}

main()

function main(): void {
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
  // INFO: Private plugin method
  // Only if you are making a private plugin (publishing it internally to your
  // company that is on an Organization plan) you can get the file key
  const fileId: string = figma.fileKey || root.getPluginData('shareFileId')

  const scaling: string = root.getPluginData('urlQueryParamScaling')
  const nodes: NodeObj[] = convertNodesToJSON(findItemsForLink())

  if (!nodes || !nodes.length) {
    return figma.closePlugin('ERROR: Could not get the link item')
  }

  if (!fileId && action === PluginActions.copy) action = PluginActions.setup

  switch (action as string) {
    case PluginActions.setup: {
      figma.showUI(__html__, {
        width: 295,
        height: 285,
      })

      figma.ui.postMessage(
        {act: PluginActions.setup, nodes, fileId, scaling, fileName: root.name},
        {origin: '*'}
      )
      break
    }
    case PluginActions.about: {
      figma.showUI(__html__, {
        width: 282,
        height: 380,
      })

      figma.ui.postMessage(
        {act: PluginActions.about, nodes, fileId, scaling, fileName: root.name},
        {origin: '*'}
      )
      break
    }
    case PluginActions.copy: {
      figma.showUI(__html__, {
        width: 0,
        height: 0,
      })

      figma.ui.postMessage(
        {act: PluginActions.copy, nodes, fileId, scaling, fileName: root.name},
        {origin: '*'}
      )
      break
    }
  }

  figma.ui.onmessage = (msg: PluginMessage) => {
    if (msg.type === 'message' && msg.message) {
      figma.notify(msg.message || '')
      return
    } else if (msg.type === 'cancel') {
      figma.closePlugin()
      return
    } else if (msg.type === 'save-config') {
      root.setPluginData('shareFileId', msg.payload.fileId)
      root.setPluginData('urlQueryParamScaling', msg.payload.scaling || '')
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
}

function findItemsForLink(): Array<PageNode | SceneNode | BaseNode> {
  let linkItems: Array<PageNode | SceneNode | BaseNode> = []

  if (!selectedItems.length) {
    linkItems.push(figma.currentPage)
  } else {
    for (const selectedItem of selectedItems) {
      const parents: Map<string, SceneNode | BaseNode> = getParentsList(
        selectedItem
      )
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
