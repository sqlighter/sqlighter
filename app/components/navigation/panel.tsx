//
// panel.tsx - basic box with metadata, eg: title, icon, etc
//

// TODO support drag and drop inside panel with callback

export interface PanelProps {
  /** Id used for tabs, selections, paths, etc (optional) */
  id?: string

  /** Panel title (optional) */
  title?: string

  /** Panel's description (optional) */
  description?: string

  /** Icon that can be used to represent this panel for tabs, navigation, menus (optional) */
  icon?: React.ReactNode | string

  /** Layout contents (optional) */
  children?: React.ReactNode
}

/** A simple panel (used mostly to pass props to tabs or other layout componentsawer, header, footer, basic actions */
export function Panel(props: PanelProps) {
  return <>props.children</>
}
