//
// client.test.ts
//

import { formatDuration, formatSeconds } from "./client"
import parseISO from "date-fns/parseISO"

describe("client.ts", () => {
  test("formatSeconds", () => {
    let date1 = parseISO("2022-06-02 12:18:00")
    let date2 = parseISO("2022-06-02 12:18:02.31234567")
    let duration = formatSeconds(date1, date2)
    expect(duration).toBe("2.312 s")

    date1 = parseISO("2022-06-02 12:08:00")
    date2 = parseISO("2022-06-02 13:18:02.300")
    duration = formatSeconds(date1, date2)
    expect(duration).toBe("4,202.3 s")
  })

  test("formatDuration", () => {
    let date1 = parseISO("2022-06-02 12:18:00")
    let date2 = parseISO("2022-06-02 12:18:02.31234567")
    let duration = formatDuration(date1, date2)
    expect(duration).toBe("less than 5 seconds")

    // withMs
    duration = formatDuration(date1, date2, true)
    expect(duration).toBe("2.312 s")

    date1 = parseISO("2022-06-02 12:08:00")
    date2 = parseISO("2022-06-02 13:18:02.300")
    duration = formatDuration(date1, date2)
    expect(duration).toBe("about 1 hour")

    date1 = parseISO("2022-06-01 07:08:00")
    date2 = parseISO("2022-06-02 13:18:02.300")
    duration = formatDuration(date1, date2)
    expect(duration).toBe("1 day")
  })
})
