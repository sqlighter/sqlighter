//
// articles.test.ts
//

import { Article } from "./articles"

describe("articles.ts", () => {
  test("getContents (default)", async () => {
    expect(Article.itemType).toBe("article")
    const articles = await Article.getContents()
    expect(Object.keys(articles).length).toBeGreaterThan(2)

    for (const article of Object.values(articles)) {
      expect(article).toBeInstanceOf(Article)
      expect(article.id).toBeTruthy()
      expect(article.id).toBe(article.id.toLowerCase())
      expect(article.title).toBeTruthy()
      expect(article.content).toBeTruthy()

      // description is optional
      // expect(topic.description).toBeTruthy()
    }
  })

  test("getContent (default)", async () => {
    const article = await Article.getContent("what-is-cholesterol")
    expect(article).toBeInstanceOf(Article)
    expect(article.id).toBe("what-is-cholesterol")
    expect(article.title).toBe("What is Cholesterol?")
    expect(article.description).toBe("Cholesterol 101: An introduction")
    expect(article.status).toBe("published")
  })

  test("getContent (en-US)", async () => {
    const article = await Article.getContent("what-is-cholesterol", "en-US")
    expect(article).toBeInstanceOf(Article)
    expect(article.id).toBe("what-is-cholesterol")
    expect(article.title).toBe("What is Cholesterol?")
    expect(article.description).toBe("Cholesterol 101: An introduction")
    expect(article.status).toBe("published")
  })

  test("getContent (it-IT)", async () => {
    const article = await Article.getContent("what-is-cholesterol", "en-US")
    expect(article).toBeInstanceOf(Article)
    // TODO translate article and test in Italian
    expect(article.id).toBe("what-is-cholesterol")
    expect(article.title).toBe("What is Cholesterol?")
    expect(article.description).toBe("Cholesterol 101: An introduction")
    expect(article.status).toBe("published")
  })
})
