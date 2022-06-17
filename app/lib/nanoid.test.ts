//
// nanoid.test.ts
//

import { generateId } from "./nanoid"

describe("nanoid.ts", () => {
  test("generateId", () => {
    const id1 = generateId("tst_")
    const id2 = generateId("tst_")

    expect(id1).not.toBeNull()
    expect(id1).toHaveLength(4 + 20)
    expect(id1.startsWith("tst_")).toBeTruthy()

    expect(id2).not.toBeNull()
    expect(id2).toHaveLength(4 + 20)
    expect(id2.startsWith("tst_")).toBeTruthy()
    expect(id2).not.toMatch(id1)
  })
})
