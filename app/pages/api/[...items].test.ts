//
// [...items].test.ts - testing generic items API routes
//

import pluralize from "pluralize"

describe("Items APIs", () => {
  test("pluralize", () => {
    expect(pluralize.singular("items")).toBe("item")
    expect(pluralize.singular("queries")).toBe("query")
  })
})
