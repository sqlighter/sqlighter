import { useEffect, useState } from "react"

// NOTE check https://usehooks.com/useScript/

export function useSqljs() {
  const [engine, setEngine] = useState(null)
  const [windowWatcher, setWindowWatcher] = useState(false)

  useEffect(() => {
    if (window) {
      console.log("Running in a browser, checking for loadSQL")

      const timer = setInterval(() => {
        console.log("Polling...")

        // @ts-ignore
        if (window.loadSQL) {
          console.log("Clearing timer")
          clearInterval(timer)
          setWindowWatcher(true)
        }
      }, 500)
    }
  }, [])

  useEffect(() => {
    console.log("Looking for loadSQL")
    // @ts-ignore
    if (window.loadSQL) {
      console.log("Should try initSQLJS")
      // @ts-ignore
      window.loadSQL().then((db) => {
        console.log("I have the database")
        setEngine(db)
      })
    }
    return () => {}
  }, [windowWatcher])

  return engine
}

export function useDB(data) {
  const [engine, setEngine] = useState(null)
  const [db, setDB] = useState(null)
  const [windowWatcher, setWindowWatcher] = useState(false)

  useEffect(() => {
    if (window) {
      console.log("Running in a browser, checking for loadSQL")

      const timer = setInterval(() => {
        console.log("Polling...")

        // @ts-ignore
        if (window.loadSQL) {
          console.log("Clearing timer")
          clearInterval(timer)
          setWindowWatcher(true)
        }
      }, 500)
    }
  }, [])

  useEffect(() => {
    console.log("Looking for loadSQL")
    // @ts-ignore
    if (window.loadSQL) {
      console.log("Should try initSQLJS")
      // @ts-ignore
      window.loadSQL().then((db) => {
        console.log("I have the database")
        setEngine(db)
      })
    }
    return () => {}
  }, [windowWatcher])

  useEffect(() => {
    if (engine && data) {
      console.log("Starting up the engine")

      // @ts-ignore
      setDB(new engine.Database(new Uint8Array(data)))
    }

    return () => {}
  }, [data, engine])

  return db
}

export function useDBQuery(db, query) {
  const [results, setResults] = useState(null)

  useEffect(() => {
    if (db) {
      console.log(`Running query ${query}`)
      const r = db.exec(query)
      console.log(r)
      // @ts-ignore
      window.results = r
      setResults(r)
    }
  }, [db, query])

  return results
}
