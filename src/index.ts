const currentPage: PageNode = figma.currentPage
const selectedItems: ReadonlyArray<SceneNode> = currentPage.selection
const root: DocumentNode = figma.root

interface NodeObj {
  id: string
  name: string
}

main()


function main (): void {
  switch (figma.command as string) {
    case 'copyPrototypeLink': {
      return openWindow('copy')
    }
    case 'settings': {
      return openWindow('setup')
    }
  }

  figma.closePlugin('ERROR: Unknown command')
}

function openWindow (action: 'setup'|'copy'): void {
  const nodes: NodeObj[] = convertNodesToJSON(findItemsForLink())

  if (!nodes || !nodes.length) {
    return figma.closePlugin('ERROR: Could not get the link item')
  }

  const fileId: string = root.getPluginData('shareFileId')

  if (!fileId && action === 'copy') action = 'setup'

  switch (action as string) {
    case 'setup': {
      figma.showUI(__html__, {
        width: 280,
        height: 255
      })

      figma.ui.postMessage(
        {act: 'setup', nodes, fileId, fileName: root.name},
        {origin: '*'}
      )
      break
    }
    case 'copy': {
      figma.showUI(__html__, {
        width: 0,
        height: 0
      })

      figma.ui.postMessage(
        {act: 'copy', nodes, fileId, fileName: root.name},
        {origin: '*'}
      )
      break
    }
  }

  figma.ui.onmessage = (msg: any) => {
    if (msg.type === 'cancel') {
      figma.closePlugin()
      return
    }
    if (msg.type === 'save-file-id') {
      root.setPluginData('shareFileId', msg.fileId)
      return
    }
    if (msg.type === 'link-copied') {
      figma.closePlugin(nodes.length > 1
        ? `Prototype links (${nodes.length}) copied to clipboard`
        : 'Prototype link copied to clipboard'
      )
      return
    }

    figma.closePlugin()
  }
}

function findItemsForLink (): Array<PageNode|SceneNode|BaseNode> {
  let linkItems: Array<PageNode|SceneNode|BaseNode> = []

  if (!selectedItems.length) {
    linkItems.push(figma.currentPage)
  } else {
    for (const selectedItem of selectedItems) {
      const parents: Map<string, SceneNode|BaseNode> = getParentsList(
        selectedItem
      )
      const keys: string[] = Array.from(parents.keys())

      for (let i = keys.length - 1; i >= 0; i--) {
        const id: string = keys[i]
        const item: SceneNode|BaseNode = parents.get(id)
        const prev_id: string = keys[i - 1]
        const prev_item: SceneNode|BaseNode = parents.get(prev_id)

        if (item.type !== 'PAGE') continue

        if (prev_item && prev_item.type === 'FRAME') linkItems.push(prev_item)
        else linkItems.push(item)
        break
      }
    }
  }

  return uniqueBy(
    linkItems.filter(n => n),
    'id'
  )
}

function getParentsList (
  node: SceneNode|BaseNode): Map<string, SceneNode|BaseNode> {

  const map: Map<string, SceneNode|BaseNode> = new Map()

  if (!node) return map

  let _parent: SceneNode|BaseNode|undefined = node

  while (_parent) {
    map.set(_parent.id, _parent)
    _parent = _parent.id === root.id ? undefined : _parent.parent
  }

  return map
}

function convertNodesToJSON (nodes: Array<PageNode|SceneNode|BaseNode>): NodeObj[] {
  return nodes.map(node => ({
    id: node.id,
    name: node.name
  }))
}

function uniqueBy (arr: any[], key: string): any[] {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}
