//
// topics.test.ts
//

import { Topic } from "./topics"

describe("topics.ts", () => {
  test("getContents (default)", () => {
    expect(Topic.contentType).toBe("topic")
    const topics = Topic.getContents()
    expect(Object.keys(topics).length).toBeGreaterThan(4);

    for (const topic of Object.values(topics)) {
      expect(topic).toBeInstanceOf(Topic)
      expect(topic.id).toBeTruthy()
      expect(topic.id).toBe(topic.id.toLowerCase())
      expect(topic.title).toBeTruthy()
      expect(topic.description).toBeTruthy()
      expect(topic.content).toBeTruthy()
    }
  })

  test("getContent (default)", () => {
    const topic = Topic.getContent("inflammation-group")
    expect(topic).toBeInstanceOf(Topic)
    expect(topic.id).toBe("inflammation-group")
    expect(topic.title).toBe('Inflammation group')
    expect(topic.description).toBe('Immune system function')
    expect(topic.status).toBe('published')
  })

  test("getContent (en-US)", () => {
    const topic = Topic.getContent("inflammation-group", "en-US")
    expect(topic).toBeInstanceOf(Topic)
    expect(topic.id).toBe("inflammation-group")
    expect(topic.title).toBe('Inflammation group')
    expect(topic.description).toBe('Immune system function')
    expect(topic.status).toBe('published')
  })

  test("getContent (it-IT)", () => {
    const topic = Topic.getContent("inflammation-group", "it-IT")
    expect(topic).toBeInstanceOf(Topic)
    expect(topic.id).toBe("inflammation-group")
    expect(topic.title).toBe('Inflammation group')
    expect(topic.description).toBe('Immune system function')
    expect(topic.status).toBe('published')
  })

})
