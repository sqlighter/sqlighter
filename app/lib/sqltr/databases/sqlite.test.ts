//
// sqlite.ts tests
//

import { SqliteDataConnection } from "./sqlite"
import { Database, QueryExecResult } from "sql.js";
import fs from 'fs';

function printThis(value) {
  console.log(JSON.stringify(value, null, " "))
} 

// Interpreting schema
// https://www.sqlite.org/schematab.html#:~:text=Every%20SQLite%20database%20contains%20a,are%20contained%20within%20the%20database.

// AST tool
// https://astexplorer.net/


async function getChinookConnection() {
  const configs = { 
    buffer: fs.readFileSync('./lib/test/artifacts/chinook.sqlite')
  }
  return await SqliteDataConnection.create(configs)
}

describe("sqlite.ts", () => {

  test("getSchema", async () => {
    const connection = await getChinookConnection()
    const schema = await connection.getSchema()

    expect(schema).toBeTruthy()
    expect(schema.length).toBe(23)

    const json = JSON.stringify(schema, null, "  ")
    fs.writeFileSync('chinook-schema.json', json);

  })
})

