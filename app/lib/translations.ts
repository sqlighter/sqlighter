//
// translations.ts
//

export class Translation {
  constructor(args: { locale: string; [key: string]: string }) {
    this.locale = args.locale
    for (const key of Object.keys(args)) {
      if (args[key]) {
        this[key] = args[key] as string
      }
    }
  }

  /** String locale, eg. en-US, it-IT, etc... */
  locale: string;

  /** Actual translated contents */
  [key: string]: string

  //
  // static methods
  //

  public static fromObject(translations: any[]): Translation[] {
    return translations.map((t) => {
      const { languages_code, locale, id, ...keys } = t
      return new Translation({ locale: languages_code || locale, ...keys })
    })
  }
}
