const currentPage: PageNode = figma.currentPage
const selectedItems: ReadonlyArray<SceneNode> = currentPage.selection
const root: DocumentNode = figma.root


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
  const node: SceneNode|BaseNode|undefined = findItemForLink()

  if (!node) {
    return figma.closePlugin('ERROR: Could not get the link item')
  }

  const fileId: string = root.getPluginData('shareFileId')

  if (!fileId && action === 'copy') action = 'setup'

  switch (action as string) {
    case 'setup': {
      figma.showUI(__html__, {
        width: 350,
        height: 310
      })

      figma.ui.postMessage(
        {act: 'setup', nodeId: node.id, fileId, fileName: root.name},
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
        {act: 'copy', nodeId: node.id, fileId, fileName: root.name},
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
      figma.closePlugin('Prototype link copied to clipboard')
      return
    }

    figma.closePlugin()
  }
}

function findItemForLink (): SceneNode|BaseNode|undefined {
  let linkItem: PageNode|SceneNode|BaseNode

  if (!selectedItems.length || selectedItems.length > 1) {
    linkItem = figma.currentPage
  } else {
    const parents: Map<string, SceneNode|BaseNode> = getParentsList(
      selectedItems[0]
    )
    const keys: string[] = Array.from(parents.keys())

    for (let i = keys.length - 1; i >= 0; i--) {
      const id: string = keys[i]
      const item: SceneNode|BaseNode = parents.get(id)
      const prev_id: string = keys[i - 1]
      const prev_item: SceneNode|BaseNode = parents.get(prev_id)

      if (item.type !== 'PAGE') continue

      if (prev_item && prev_item.type === 'FRAME') linkItem = prev_item
      else linkItem = item
      break
    }
  }

  return linkItem
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
