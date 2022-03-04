//
// topics.ts
//

import { Content, loadContents, DEFAULT_LOCALE } from "./contents"

export const TOPIC_TYPE = "topic"

export class Topic extends Content {
  constructor() {
    super()
    this.type = TOPIC_TYPE
  }

  /** Define content type  */
  public static get itemType(): string {
    return TOPIC_TYPE
  }

  /** Lazy load dictionary of available topics */
  public static async getContents(locale: string = DEFAULT_LOCALE): Promise<{ [contentId: string]: Content }> {
    return await loadContents<Topic>(TOPIC_TYPE, locale, Topic)
  }
}
