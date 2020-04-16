const $img: HTMLElement = document.getElementById('image')
const $message: HTMLElement = document.getElementById('message')
const $input = document.getElementById('input') as HTMLInputElement
let nodeId: string

onmessage = (event) => {
  const msg: {fileId: string, nodeId: string} = event.data.pluginMessage
  nodeId = msg.nodeId
  copyLink(msg.fileId, nodeId)
}

function copyLink (fileId: string, nodeId: string) {
  let link: string

  $img.style.display = 'none'
  $message.innerHTML = ''

  if (fileId) {
    $input.value = fileId
    link = generatePrototypeLink(fileId, nodeId)
    copyToClipboard(link)
  } else {
    $img.style.display = 'block'
    $message.innerHTML = 'Insert the File ID (you can copy it from the URL)'
  }

  return link
}

document.getElementById('copy').onclick = () => {
  const fileId: string = $input.value
  const link: string = copyLink(fileId, nodeId)
  if (!link) return
  parent.postMessage({pluginMessage: {type: 'link-copied', link, fileId}}, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({pluginMessage: {type: 'cancel'}}, '*')
}

function generatePrototypeLink (fileId: string, nodeId: string): string {
  const origin = 'https://www.figma.com'
  const pathname = `/proto/${fileId}`
  const query = `node-id=${nodeId}&scaling=min-zoom`
  return origin + pathname + '?' + query
}

function copyToClipboard (str: string): void {
  const el: HTMLTextAreaElement = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}