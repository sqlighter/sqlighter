//
// topics.ts
//

import { Content, loadContents, DEFAULT_LOCALE } from "./contents"

export class Topic extends Content {
  /** Define content type  */
  public static get contentType(): string {
    return "topic"
  }

  /** Lazy load dictionary of available topics */
  public static getContents(locale: string = DEFAULT_LOCALE): { [contentId: string]: Content } {
    return loadContents<Topic>(this.contentType, locale, Topic)
  }
}
