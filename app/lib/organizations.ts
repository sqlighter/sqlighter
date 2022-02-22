//
// organizations.ts
//

import { Content, loadContents, DEFAULT_LOCALE } from "./contents"

/** An organization, used mainly to qualify news sources with small intro, logo, etc */
export class Organization extends Content {
  /** Define content type  */
  public static get contentType(): string {
    return "organization"
  }

  /** Additional domains used by this organization */
  domains?: string[]

  //
  // static methods
  //

  /** Lazy load dictionary of available biomarkers */
  public static getContents(locale: string = DEFAULT_LOCALE): { [contentId: string]: Content } {
    return loadContents<Organization>(this.contentType, locale, Organization)
  }

  /** Returns available localized organizations */
  public static getOrganizations(locale: string = DEFAULT_LOCALE): { [organizationId: string]: Organization } {
    return this.getContents(locale) as { [organizationId: string]: Organization }
  }

  /** Returns organization by id (or undefined), localized if requested */
  public static getOrganization(organizationId: string, locale: string = DEFAULT_LOCALE): Organization | undefined {
    const organizations = Organization.getOrganizations(locale)
    return organizations[organizationId]
  }

  /** Returns the organization that publishes content from the given url (or undefined), localized if requested */
  public static getOrganizationFromUrl(url: string, locale: string = DEFAULT_LOCALE): Organization | undefined {
    try {
      const organizations = Organization.getOrganizations(locale)
      const hostname = new URL(url).hostname

      for (const org of Object.values(organizations)) {
        if (hostname == new URL(org.url).hostname) {
          return org
        }
        // has optional domains?
        if (org.domains) {
          for (const domain of org.domains) {
            if (hostname == new URL(domain).hostname) {
              return org
            }
          }
        }
      }
    } catch (exception) {
      console.warn(`Organization.getOrganizationFromUrl - ${url}`, exception)
    }
  }
}
