//
// client.test.ts
//

import { formatDuration, formatSeconds } from "./client"
import parseISO from "date-fns/parseISO"

describe("client.ts", () => {
  test("formatSeconds (with Date)", () => {
    let date1 = parseISO("2022-06-02 12:18:00")
    let date2 = parseISO("2022-06-02 12:18:02.31234567")
    let duration = formatSeconds(date1, date2)
    expect(duration).toBe("2.312 s")

    date1 = parseISO("2022-06-02 12:08:00")
    date2 = parseISO("2022-06-02 13:18:02.300")
    duration = formatSeconds(date1, date2)
    expect(duration).toBe("4,202.3 s")
  })

  test("formatSeconds (with strings)", () => {
    let date1 = "2022-06-02 12:18:00"
    let date2 = "2022-06-02 12:18:02.31234567"
    let duration = formatSeconds(date1, date2)
    expect(duration).toBe("2.312 s")

    date1 = "2022-06-02 12:08:00"
    date2 = "2022-06-02 13:18:02.300"
    duration = formatSeconds(date1, date2)
    expect(duration).toBe("4,202.3 s")
  })

  test("formatSeconds (with mixed)", () => {
    let date1 = parseISO("2022-06-02 12:18:00")
    let date2 = "2022-06-02 12:18:02.31234567"
    let duration = formatSeconds(date1, date2)
    expect(duration).toBe("2.312 s")

    let date3 = "2022-06-02 12:08:00"
    let date4 = parseISO("2022-06-02 13:18:02.300")
    duration = formatSeconds(date3, date4)
    expect(duration).toBe("4,202.3 s")
  })

  test("formatSeconds (with missing end)", () => {
    // fake current time
    jest.useFakeTimers().setSystemTime(new Date("2022-06-02 12:20:15.300"))

    let date1 = parseISO("2022-06-02 12:18:00")
    let duration1 = formatSeconds(date1)
    expect(duration1).toBe("135.3 s")
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

  test("formatDuration (with missing end)", () => {
    // fake current time
    jest.useFakeTimers().setSystemTime(new Date("2022-06-02 12:18:02.31234567"))
    let date1 = parseISO("2022-06-02 12:18:00")
    let duration = formatDuration(date1)
    expect(duration).toBe("less than 5 seconds")

    // withMs
    duration = formatDuration(date1, null, true)
    expect(duration).toBe("2.312 s")

    jest.useFakeTimers().setSystemTime(new Date("2022-06-02 13:18:02.300"))
    date1 = parseISO("2022-06-02 12:08:00")
    duration = formatDuration(date1, null)
    expect(duration).toBe("about 1 hour")

    jest.useFakeTimers().setSystemTime(new Date("2022-06-02 13:18:02.300"))
    date1 = parseISO("2022-06-01 07:08:00")
    duration = formatDuration(date1)
    expect(duration).toBe("1 day")
  })
})
