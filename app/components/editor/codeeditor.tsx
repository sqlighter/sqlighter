//
// codeeditor.tsx - text editor for programming languages (wraps monaco editor)
//

// References:
// https://www.npmjs.com/package/@monaco-editor/react
// https://microsoft.github.io/monaco-editor/index.html
// https://microsoft.github.io/monaco-editor/api/index.html

import Editor from "@monaco-editor/react"
import { CommandEvent } from "../commands"

export interface CodeEditorProps {
  /** Text being edited (initial value, will raise onCommand when changed) */
  value?: string

  /** Language used for intellisense, colorize, validation, etc... */
  language?: "javascript" | "typescript" | "html" | "css" | "sql" | string

  /** Theme, defaults to 'light'  */
  theme?: "light" | "vs-dark" | string

  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent
}

export function CodeEditor(props: CodeEditorProps) {
  //
  // handlers
  //

  /** Called when text is edited will repackage as command and dispatch to parent */
  function handleChange(value, event) {
    if (props.onCommand) {
      props.onCommand(event, {
        command: "editor.changeValue",
        args: {
          value,
        },
      })
    }
  }

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html
  const options = {
    minimap: {
      enabled: false,
    },
  }

  return (
    <Editor
      className="monacoEditor"
//      height="100%"
      width="100%"
      language={props.language || "javascript"}
      theme={props.theme || "light"}
      value={props.value}
      defaultValue="// some comment"
      options={options}
      onChange={handleChange}
    />
  )
}
