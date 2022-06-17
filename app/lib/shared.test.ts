//
// shared.test.ts
//

import { prettyBytes, prettyContentType, generateId } from "./shared"

describe("shared.ts", () => {
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

  test("prettyContentType", () => {
    expect(prettyContentType("application/pdf")).toBe("pdf")
    expect(prettyContentType("image/jpg")).toBe("jpg")
    expect(prettyContentType("video/mp4")).toBe("video")
  })

  test("prettyBytes", () => {
    let size = 300
    expect(prettyBytes(size)).toBe("300 bytes")
    expect(prettyBytes(size, "en-US")).toBe("300 bytes")
    expect(prettyBytes(size, "it-IT")).toBe("300 bytes")

    size = 1023
    expect(prettyBytes(size)).toBe("1,023 bytes")
    expect(prettyBytes(size, "en-US")).toBe("1,023 bytes")
    expect(prettyBytes(size, "it-IT")).toBe("1.023 bytes")

    size = 5 * 1024
    expect(prettyBytes(size)).toBe("5 kB")
    expect(prettyBytes(size, "en-US")).toBe("5 kB")
    expect(prettyBytes(size, "it-IT")).toBe("5 kB")

    size = 60.5 * 1024
    expect(prettyBytes(size)).toBe("60.5 kB")
    expect(prettyBytes(size, "en-US")).toBe("60.5 kB")
    expect(prettyBytes(size, "it-IT")).toBe("60,5 kB")

    size = 5 * 1024 * 1024
    expect(prettyBytes(size)).toBe("5 MB")
    expect(prettyBytes(size, "en-US")).toBe("5 MB")
    expect(prettyBytes(size, "it-IT")).toBe("5 MB")

    size = 102.32 * 1024 * 1024
    expect(prettyBytes(size)).toBe("102.32 MB")
    expect(prettyBytes(size, "en-US")).toBe("102.32 MB")
    expect(prettyBytes(size, "it-IT")).toBe("102,32 MB")

    size = 300 * 1024 * 1024
    expect(prettyBytes(size)).toBe("300 MB")
    expect(prettyBytes(size, "en-US")).toBe("300 MB")
    expect(prettyBytes(size, "it-IT")).toBe("300 MB")

    size = 0.6 * 1024 * 1024 * 1024
    expect(prettyBytes(size)).toBe("0.6 GB")
    expect(prettyBytes(size, "en-US")).toBe("0.6 GB")
    expect(prettyBytes(size, "it-IT")).toBe("0,6 GB")

    size = 1300.25 * 1024 * 1024 * 1024
    expect(prettyBytes(size)).toBe("1,300.25 GB")
    expect(prettyBytes(size, "en-US")).toBe("1,300.25 GB")
    expect(prettyBytes(size, "it-IT")).toBe("1.300,25 GB")
  })
})
