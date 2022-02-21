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
      expect(topic.title).toBeTruthy()
      expect(topic.description).toBeTruthy()
      expect(topic.content).toBeTruthy()
    }
  })
})
