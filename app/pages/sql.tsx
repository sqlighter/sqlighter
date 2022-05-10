//
// sql.tsx - basic sql.js test page
//

import * as React from "react"
import { useState, useEffect } from "react"
import Script from "next/script"

import { useUser } from "../lib/auth/hooks"
import { useDB, useDBQuery } from "../lib/useDB"
import { useBinaryFile } from "../lib/useBinaryFile"

const sqlliteURL = "/chinook.db"

/**
 * A simple SQL read-eval-print-loop
 * @param {{db: import("sql.js").Database}} props
 */
 function SQLRepl({ db }) {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  function exec(sql) {
    try {
      // The sql is executed synchronously on the UI thread.
      // You may want to use a web worker here instead
      setResults(db.exec(sql)); // an array of objects is returned
      setError(null);
    } catch (err) {
      // exec throws an error when the SQL statement is invalid
      setError(err);
      setResults([]);
    }
  }

  return (
    <div className="App">
      <h1>React SQL interpreter</h1>

      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration? Try “select sqlite_version()”"
      ></textarea>

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
  );
}

/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
function ResultsTable({ columns, values }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((columnName, i) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>

      <tbody>
        {
          // values is an array of arrays representing the results of the query
          values.map((row, i) => (
            <tr key={i}>
              {row.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}



interface SqlPageProps {
  //
}

export default function SqlPage(props: SqlPageProps) {
  // retrieve user information from current session
  const [user, { loading: userLoading }] = useUser()

  const data = useBinaryFile(sqlliteURL)
  const db = useDB(data)
  const [query, setQuery] = useState(
    "SELECT name FROM  sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';"
  )

  //  const [query, setQuery] = useState( "SELECT 1;" )
  //  const results = useDBQuery( db, data, query )
  const results = useDBQuery(db, query)
  console.log("Results", results)

  return (
    <>
      <Script type="module" strategy="beforeInteractive" src="/sql-loader.js" />
      <p>You have {results?.length} results</p>
      {results?.[0] && <ResultsTable {...results[0]} />}

      {db && <SQLRepl db={db} />}
    </>
  )
}
