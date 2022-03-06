//
// records.test.ts
//

import { Record, RECORD_TYPE, RECORD_PREFIX } from "./records"

describe("records.ts", () => {
  test("Record", async () => {
    const r1 = new Record()
    expect(r1.type).toBe(RECORD_TYPE)
    expect(r1.id).toBeTruthy()
    expect(r1.id.startsWith(RECORD_PREFIX)).toBeTruthy()
    expect(r1.id.length).toBeGreaterThan(16)
  })
})
