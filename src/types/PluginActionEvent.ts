import {ConfigParams} from './ConfigParams'
import {NodeObj} from './NodeObj'
import {PluginActions} from './PluginActions'

export interface PluginActionEventBase {
  nodes: NodeObj[]
  configParams: ConfigParams
  fileName: string
}

interface PluginActionEventSetup extends PluginActionEventBase {
  action: PluginActions.setup
}

interface PluginActionEventAbout extends PluginActionEventBase {
  action: PluginActions.about
}

interface PluginActionEventCopy extends PluginActionEventBase {
  action: PluginActions.copy
}

export type PluginActionEvent =
  | PluginActionEventSetup
  | PluginActionEventAbout
  | PluginActionEventCopy
