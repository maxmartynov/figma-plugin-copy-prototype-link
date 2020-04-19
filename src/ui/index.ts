import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})


// const $img: HTMLElement = document.getElementById('image')
// const $message: HTMLElement = document.getElementById('message')
// const $input = document.getElementById('input') as HTMLInputElement
// let nodeId: string
// let fileName: string

// onmessage = (event) => {
//   const msg: {fileId: string, nodeId: string, fileName: string} =
//     event.data.pluginMessage

//   nodeId = msg.nodeId
//   fileName = msg.fileName
//   copyLink(msg.fileId, fileName, nodeId)
// }

// function copyLink (fileId: string, fileName: string, nodeId: string): string {
//   let link: string

//   $img.style.display = 'none'
//   $message.innerHTML = ''

//   if (fileId) {
//     $input.value = fileId
//     link = generatePrototypeLink(fileId, fileName, nodeId)
//     copyToClipboard(link)
//   } else {
//     $img.style.display = 'block'
//     $message.innerHTML = 'Insert the File ID (you can copy it from the URL)'
//   }

//   return link
// }

// document.getElementById('copy').onclick = () => {
//   execFileIdFromInput()

//   const fileId: string = $input.value
//   const link: string = copyLink(fileId, fileName, nodeId)
//   if (!link) return
//   parent.postMessage({pluginMessage: {type: 'link-copied', link, fileId}}, '*')
// }

// document.getElementById('cancel').onclick = () => {
//   parent.postMessage({pluginMessage: {type: 'cancel'}}, '*')
// }

// const REG_URL: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
// const REG_URL_FIGMA: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(www)?[\.]?figma\.com(:[0-9]{1,5})?(\/.*)?$/gm
// const REG_URL_FILE_ID: RegExp = /\/?(file|proto)\/([a-zA-Z0-9]+)\/?/gm

// function execFileIdFromInput (): string {
//   let fileId: string = ''
//   const value: string = $input.value

//   if (!value) return fileId

//   if (REG_URL.test(value)) {
//     if (!REG_URL_FIGMA.test(value)) {
//       throw new Error('Used URL is not figma.com')
//     }

//     const res: string[] = REG_URL_FILE_ID.exec(value)
//     fileId = res && res[2]
//   } else if (REG_URL_FILE_ID.test(value)) {
//     const res: string[] = REG_URL_FILE_ID.exec(value)
//     fileId = res && res[2]
//   } else {
//     fileId = value.replace(/\//g, '')
//   }

//   return fileId
// }

// function generatePrototypeLink (
//   fileId: string, fileName: string, nodeId: string): string {

//   const _nodeId: string = encodeURIComponent(nodeId)
//   const _fileName: string = encodeURIComponent(fileName)

//   const origin: string = 'https://www.figma.com'
//   const pathname: string = `/proto/${fileId}/${_fileName}`
//   const query: string = `node-id=${_nodeId}&scaling=min-zoom`
//   return origin + pathname + '?' + query
// }

// function copyToClipboard (str: string): void {
//   const el: HTMLTextAreaElement = document.createElement('textarea')
//   el.value = str
//   document.body.appendChild(el)
//   el.select()
//   document.execCommand('copy')
//   document.body.removeChild(el)
// }
