//
// panel.tsx - basic box with metadata, eg: title, icon, etc
//

import { CommandEvent } from "../../lib/commands"

export interface PanelProps {
  /** Classname that should be added to this panel's root element (optional) */
  className?: string

  /** Id used for tabs, selections, paths, etc (optional) */
  id?: string

  /** Panel title (optional) */
  title?: string

  /** Description as a string or other elements like tags, etc (optional) */
  description?: string

  /** Icon that can be used to represent this panel for tabs, navigation, menus (optional) */
  icon?: React.ReactNode | string

  /** Layout contents (optional) */
  children?: React.ReactNode

  /** Callback used by this panel to dispatch commands back to parent components */
  onCommand?: CommandEvent
}

/** A simple panel (used mostly to as a simple base class to standardize props in tabs, headers, footers, layout components, etc */
export function Panel(props: PanelProps) {
  return <>{props.children}</>
}

/** A react element that implements or extend basic panel properties */
export type PanelElement = React.ReactElement<PanelProps, React.FunctionComponent<PanelProps>>
