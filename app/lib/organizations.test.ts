//
// organizations.test.ts
//

import { Organization } from "./organizations"

describe("organizations.ts", () => {
  test("getOrganizations", () => {
    const orgs = Organization.getOrganizations()
    expect(orgs).toBeTruthy()

    // check that all orgs have basic info
    for (const org of Object.values(orgs)) {
      expect(org.id).toBeTruthy()
      expect(org.title).toBeTruthy()
      expect(org.description).toBeTruthy()
      expect(org.content).toBeTruthy()
      expect(org.locale).toBeTruthy()
      expect(org.url).toBeTruthy()
      expect(org.images.length).toBeGreaterThanOrEqual(1)
    }
  })

  test("getOrganization (data)", () => {
    const en1 = Organization.getOrganization("medline-plus")

    expect(en1.id).toBe("medline-plus")
    expect(en1.title).toBe("MedlinePlus")
    expect(en1.description).toContain("MedlinePlus")
    expect(en1.content).toContain("MedlinePlus")
    expect(en1.url).toBe("https://medlineplus.gov")
    expect(en1.locale).toBe("en-US")
  })

  test("getOrganization (images)", () => {
    const en1 = Organization.getOrganization("medline-plus")

    expect(en1.images).toBeTruthy()
    expect(en1.images).toHaveLength(1)

    const logo1 = en1.images[0]
    expect(logo1.name).toBe("medline-plus.png")
    expect(logo1.type).toBe("png")
    expect(logo1.path).toContain("/organizations/images/medline-plus.png")
    expect(logo1.width).toBe(325)
    expect(logo1.height).toBe(67)
  })

  test("getOrganizationFromUrl", () => {
    // url from main domain
    const en1 = Organization.getOrganizationFromUrl("https://medlineplus.gov/lab-tests/albumin-blood-test/")
    expect(en1).toBeTruthy()
    expect(en1.id).toBe("medline-plus")

    // url from secondary domain
    const en2 = Organization.getOrganizationFromUrl(
      "https://healthy.thewom.it/divulgazione/aumento-difese-immunitarie/"
    )
    expect(en2).toBeTruthy()
    expect(en2.id).toBe("valori-normali")

    // url from organization which we don't have
    const en3 = Organization.getOrganizationFromUrl(
      "https://healthy.madeupname.com/divulgazione/aumento-difese-immunitarie/"
    )
    expect(en3).toBeUndefined()
  })
})
