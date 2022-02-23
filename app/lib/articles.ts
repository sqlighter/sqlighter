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
  public static getContents(locale: string = DEFAULT_LOCALE): { [contentId: string]: Content } {
    return loadContents<Article>(this.contentType, locale, Article)
  }
}
