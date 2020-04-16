const selectedItems: ReadonlyArray<SceneNode> = figma.currentPage.selection
const currentPage: PageNode = figma.currentPage
const root: DocumentNode = figma.root


main()


function main (): void {
  if (selectedItems.length === 0) {
    return figma.closePlugin('No layer selected')
  }

  const node: SceneNode|BaseNode|undefined = findItemForLink()

  if (!node) {
    return figma.closePlugin('ERROR: Could not get the link item')
  }
  figma.showUI(__html__, {
    width: 500,
    height: 300
  })

  getNodePrototypeLink(node)
}

async function getNodePrototypeLink (node: SceneNode|BaseNode): Promise<void> {
  const fileId: string = await figma.clientStorage.getAsync('shareFileId')

  figma.ui.postMessage({nodeId: node.id, fileId, fileName: root.name}, {origin: '*'})

  figma.ui.onmessage = async (msg) => {
    if (msg.type === 'cancel') {
      figma.closePlugin()
      return
    }
    if (msg.type === 'link-copied') {
      await figma.clientStorage.setAsync('shareFileId', msg.fileId)
      figma.closePlugin('Prototype link copied to clipboard')
      return
    }

    figma.closePlugin()
  }
}

function findItemForLink (): SceneNode|BaseNode|undefined {
  let linkItem: PageNode|SceneNode|BaseNode

  if (selectedItems.length > 1) {
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
