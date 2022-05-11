//
// sql.tsx - basic sql.js test page
//

import * as React from "react"
import { useState, useEffect } from "react"
import Script from "next/script"

import Box from "@mui/material/Box"

import { DataGrid } from "@mui/x-data-grid"

import { useUser } from "../lib/auth/hooks"
import { useDB, useDBQuery } from "../lib/useDB"
import { useBinaryFile } from "../lib/useBinaryFile"

const sqlliteURL = "/chinook.db"

/**
 * A simple SQL read-eval-print-loop
 * @param {{db: import("sql.js").Database}} props
 */
function SQLRepl({ db }) {
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])

  function exec(sql) {
    try {
      // The sql is executed synchronously on the UI thread.
      // You may want to use a web worker here instead
      const results = db.exec(sql)
      console.debug("results3", results)
      setResults(results) // an array of objects is returned
      setError(null)
    } catch (err) {
      // exec throws an error when the SQL statement is invalid
      setError(err)
      setResults([])
    }
  }

  return (
    <div className="App">
      <h1>React SQL interpreter</h1>

      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration? Try “select sqlite_version()”"
      >
        select * from customers
      </textarea>

      <pre className="error">{(error || "").toString()}</pre>

      <pre>
        {
          // results contains one object per select statement in the query
          results.map(({ columns, values }, i) => (
            <ResultsTable key={i} columns={columns} values={values} />
          ))
        }
      </pre>
    </div>
  )
}

/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
function ResultsTable({ columns, values }) {
  const columns3 = columns.map((column) => {
    return { field: column, headerName: column, minWidth: 150, editable: true }
  })

  const rows3 = values.map((value, rowIndex) => {
    const valueDict = {}
    columns3.forEach((element, columnIndex) => {
      valueDict["id"] = rowIndex
      valueDict[element.field] = value[columnIndex]
    })
    return valueDict
  })

  console.log("mappato", columns3)
  console.log("values4", rows3)

  return (
    <>
      <div style={{ display: "flex", height: "100%", minHeight: 400 }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid          
            rows={rows3}
            columns={columns3}
            pageSize={50}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      </div>
    </>
  )
}

interface SqlPageProps {
  //
}

export default function SqlPage(props: SqlPageProps) {
  // retrieve user information from current session
  const [user, { loading: userLoading }] = useUser()

  const data = useBinaryFile(sqlliteURL)
  const db = useDB(data)
  const columnsQuery = "SELECT name FROM  sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';"
//  const columnsQuery = "SELECT name FROM  sqlite_schema"
  const [query, setQuery] = useState(columnsQuery)

  //  const [query, setQuery] = useState( "SELECT 1;" )
  //  const results = useDBQuery( db, data, query )
  const results = useDBQuery(db, query)
  console.log("Results", results)

  const columns = results?.[0].values

  const querySql3 = "SELECT * FROM sqlite_schema"
  const [query3, setQuery3] = useState(querySql3)
  const results3 = useDBQuery(db, query3)



  return (
    <>
      <Script type="module" strategy="beforeInteractive" src="/sql-loader.js" />
    {results3 && <ResultsTable columns={results3[0].columns} values={results3[0].values} />}

      <p>Columns: {columns && columns.map(column => <div>{column}</div>)}</p>

      {db && <SQLRepl db={db} />}
    </>
  )
}
