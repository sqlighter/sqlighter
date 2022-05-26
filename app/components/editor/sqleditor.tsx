//
// sqleditor.tsx - code editor fixed on sql queries
//

import { CodeEditor, CodeEditorProps } from "./codeeditor"

// could add monaco-sql-languages?
// https://github.com/DTStack/monaco-sql-languages
// could generate a custom language model which includes the schema using monarch
// https://microsoft.github.io/monaco-editor/monarch.html

export interface SqlEditorProps extends CodeEditorProps {
  //
}

export function SqlEditor(props: SqlEditorProps) {
  // TODO provide an intellisense language worker for monaco that understands sql and the connection's schema
  return <CodeEditor {...props} language="sql" />
}
