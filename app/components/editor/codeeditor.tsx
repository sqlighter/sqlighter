//
// codeeditor.tsx - text editor for programming languages (wraps monaco editor)
//

// References:
// https://www.npmjs.com/package/@monaco-editor/react
// https://microsoft.github.io/monaco-editor/index.html
// https://microsoft.github.io/monaco-editor/api/index.html

import Editor, { OnMount } from "@monaco-editor/react"
import { CommandEvent } from "../../lib/commands"

export interface CodeEditorProps {
  /** Text being edited (initial value, will raise onCommand when changed) */
  value?: string

  /** Language used for intellisense, colorize, validation, etc... */
  language?: "javascript" | "typescript" | "html" | "css" | "sql" | string

  /** Theme, defaults to 'light'  */
  theme?: "light" | "vs-dark" | string

  /** Should the editor be read only? Defaults to false */
  readOnly?: boolean

  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent

  /**
   * Signature: function(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void
   * An event is emitted when the editor is mounted
   * It gets the editor instance as a first argument and the monaco instance as a second
   * Defaults to "noop"
   */
  onMount?: OnMount
}

export function CodeEditor(props: CodeEditorProps) {
  //
  // handlers
  //

  /** Called when text is edited will repackage as command and dispatch to parent */
  function handleChange(value, event) {
    if (props.onCommand) {
      props.onCommand(event, { command: "changeValue", args: { value } })
    }
  }

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html
  const options = {
    minimap: {
      enabled: false,
    },
    readOnly: props.readOnly,
  }

  return (
    <Editor
      className="monacoEditor"
      width="100%"
      language={props.language || "javascript"}
      theme={props.theme || "light"}
      value={props.value}
      options={options}
      onMount={props.onMount}
      onChange={handleChange}
    />
  )
}
