//
// organizations.ts
//

import assert from "assert"
import path from "path"
import { getContentFiles, getContentImages, ContentImages, DEFAULT_LOCALE } from "./contents"

/** An organization, used mainly to qualify news sources with small intro, logo, etc */
export class Organization {
  constructor(id: string) {
    this.id = id
  }

  /** Organization id, eg. medline-plus */
  id: string

  /** Organization title, eg. MedlinePlus */
  title: string = ""

  /** A short description, eg. MedlinePlus is an online health information... (localized) */
  description: string = ""

  /** Url of main website for this organization, eg. https://medlineplus.gov */
  url: string = ""

  /** Additional domains used by this organization */
  domains?: string[]

  /** Organization's page content in markdown format (localized) */
  content: string = ""

  /** Main locale used by content on this organization's main site */
  locale?: string

  /** Logo images for this organization */
  images?: ContentImages[]

  /** Localized content is lazy loaded synchronously just once from /contents/organizations/ */
  private static readonly _organizations: { [locale: string]: { [organizationId: string]: Organization } } = {}

  //
  // static methods
  //

  /** Returns available localized organizations */
  public static getOrganizations(locale: string = DEFAULT_LOCALE): { [organizationId: string]: Organization } {
    if (!Organization._organizations[locale]) {
      const organizationsDirectory = path.resolve("./contents/organizations")
      const contents = getContentFiles(organizationsDirectory, locale)
      const organizations = {}
      for (const content of contents) {
        organizations[content.id] = Organization.fromObject(content)
      }

      // find logos in /images directory
      const images = getContentImages(organizationsDirectory)
      for (const image of images) {
        const organizationId = image.name.substring(0, image.name.indexOf("."))
        const organization = organizations[organizationId]
        if (organization) {
          if (!organization.images) {
            organization.images = []
          }
          organization.images.push(image)
        } else console.warn(`getOrganizations - cannot find organization for image ${image.path}`)
      }

      Organization._organizations[locale] = organizations
    }
    return Organization._organizations[locale]
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

  /** Creates an organization from an object */
  public static fromObject(obj: any): Organization {
    if (!obj.id) {
      console.error(`Organization.fromObject - object missing id field`, obj)
      assert(obj.id)
    }
    return Object.assign(new Organization(obj.id), obj)
  }

  /**
   * Will render to id if nested in a json
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
   */
  /* 
  public toJSON(key: any) {
    return key ? this.id : this
  }*/
}
