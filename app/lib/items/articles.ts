//
// articles.ts
//

import { Content, loadContents, DEFAULT_LOCALE } from "./contents"

export const ARTICLE_TYPE = "article"

export class Article extends Content {
  constructor() {
    super()
    this.type = ARTICLE_TYPE
  }

  /** Define content type  */
  public static get itemType(): string {
    return ARTICLE_TYPE
  }

  /** Lazy load dictionary of available articles */
  public static async getContents(locale: string = DEFAULT_LOCALE): Promise<{ [contentId: string]: Content }> {
    return await loadContents<Article>(ARTICLE_TYPE, locale, Article)
  }
}
