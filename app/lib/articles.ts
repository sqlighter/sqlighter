//
// articles.ts
//

import { Content, loadContents, DEFAULT_LOCALE } from "./contents"

export class Article extends Content {
  /** Define content type  */
  public static get contentType(): string {
    return "article"
  }

  /** Lazy load dictionary of available articles */
  public static async getContents(locale: string = DEFAULT_LOCALE): Promise<{ [contentId: string]: Content }> {
    return await loadContents<Article>(this.contentType, locale, Article)
  }
}
