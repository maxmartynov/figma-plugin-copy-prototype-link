import {ConfigParams} from './ConfigParams'

interface PluginMessageText {
  type: 'message'
  message: string
}
interface PluginMessageCancel {
  type: 'cancel'
}
interface PluginMessageConfig {
  type: 'save-config'
  payload: ConfigParams
}
interface PluginMessageLinksCopied {
  type: 'links-copied'
}

export type PluginMessage =
  | PluginMessageText
  | PluginMessageCancel
  | PluginMessageConfig
  | PluginMessageLinksCopied
