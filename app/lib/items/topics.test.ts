//
// topics.test.ts
//

import { Topic } from "./topics"

describe("topics.ts", () => {
  test("getContents (default)", async () => {
    expect(Topic.itemType).toBe("topic")
    const topics = await Topic.getContents()
    expect(Object.keys(topics).length).toBeGreaterThan(4)

    for (const topic of Object.values(topics)) {
      expect(topic).toBeInstanceOf(Topic)
      expect(topic.id).toBeTruthy()
      expect(topic.id).toBe(topic.id.toLowerCase())
      expect(topic.title).toBeTruthy()
      expect(topic.description).toBeTruthy()
      expect(topic.content).toBeTruthy()
    }
  })

  test("getContent (default)", async () => {
    const topic = await Topic.getContent("inflammation-group")
    expect(topic).toBeInstanceOf(Topic)
    expect(topic.id).toBe("inflammation-group")
    expect(topic.title).toBe("Inflammation group")
    expect(topic.description).toBe("Immune system function")
    expect(topic.status).toBe("published")
  })

  test("getContent (en-US)", async () => {
    const topic = await Topic.getContent("inflammation-group", "en-US")
    expect(topic).toBeInstanceOf(Topic)
    expect(topic.id).toBe("inflammation-group")
    expect(topic.title).toBe("Inflammation group")
    expect(topic.description).toBe("Immune system function")
    expect(topic.status).toBe("published")
  })

  test("getContent (it-IT)", async () => {
    const topic = await Topic.getContent("inflammation-group", "it-IT")
    expect(topic).toBeInstanceOf(Topic)
    expect(topic.id).toBe("inflammation-group")
    expect(topic.title).toBe("Inflammation group")
    expect(topic.description).toBe("Immune system function")
    expect(topic.status).toBe("published")
  })
})
