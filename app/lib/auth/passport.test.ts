//
// passport.test.ts
//

import { ItemsTable } from "../database"
import { getUser, signinUser } from "./passport"

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe("passport.ts", () => {
  // table used to test database
  let itemsTable: ItemsTable = null
  jest.setTimeout(60 * 1000)

  // start each test with an empty table
  beforeEach(async () => {
    itemsTable = new ItemsTable()
    await itemsTable.resetTable()

    // TODO a couple of tests fail if you remove this delay. probably issues with pooling or timing of deletes
    await sleep(500)

    const u1 = await getUser(mockUserJon().id)
    expect(u1).toBeNull()
    const u2 = await getUser(mockUserJane().id)
    expect(u2).toBeNull()
  })

  test("getUser with missing user", async () => {
    const user = await getUser("missing@doe.com")
    expect(user).toBeNull()
  })

  test("getUser with valid email", async () => {
    let user = await getUser("johndoe@gmail.com")
    expect(user).toBeNull()

    itemsTable.insertItem(mockUserJon())
    itemsTable.insertItem(mockUserJane())

    user = await getUser(mockUserJon().id)
    expect(user.id).toStrictEqual(mockUserJon().id)
    expect(user.passport.displayName).toStrictEqual(mockUserJon().passport.displayName)

    user = await getUser(mockUserJane().id)
    expect(user.id).toStrictEqual(mockUserJane().id)
    expect(user.passport.displayName).toStrictEqual(mockUserJane().passport.displayName)
  })

  test("signinUser with new profile", async () => {
    let user = await signinUser(mockUserJon().passport)
    expect(user).toBeTruthy()
    expect(user.id).toStrictEqual(mockUserJon().id)
    expect(user.passport.displayName).toStrictEqual(mockUserJon().passport.displayName)
  })

  test("signinUser with existing profile", async () => {
    itemsTable.insertItem(mockUserJon())
    itemsTable.insertItem(mockUserJane())
    if (await getUser(mockUserJon().id)) {
      debugger
    }
    expect(await getUser(mockUserJon().id)).toBeTruthy()
    expect(await getUser(mockUserJane().id)).toBeTruthy()

    for (let i = 0; i < 5; i++) {
      // john already exists
      let user = await signinUser(mockUserJon().passport)
      expect(user).toBeTruthy()
      expect(user.id).toStrictEqual(mockUserJon().id)
      expect(user.passport.displayName).toStrictEqual(mockUserJon().passport.displayName)
    }
  })

  test("signinUser with missing email", async () => {
    const profile = mockUserJon().passport
    profile.emails = null

    let hasThrown = false
    try {
      await signinUser(profile)
    } catch (exception) {
      hasThrown = true
    }
    expect(hasThrown).toBeTruthy()
  })

  test("signinUser with updated profile", async () => {
    itemsTable.insertItem(mockUserJon())
    itemsTable.insertItem(mockUserJane())
    await sleep(500)

    const john1 = await getUser(mockUserJon().id)
    console.log(john1)
    expect(john1).toBeTruthy()
    const updated1 = john1.updatedAt

    // sleep so we can get different updatedAt timestamps even with second resolution
    await sleep(2000)

    for (let v = 2; v < 5; v++) {
      // signin user with changed profile information
      let updatedProfile = mockUserJon().passport
      updatedProfile.displayName = `John v${v}.0`
      const john2 = await signinUser(updatedProfile)

      // user profile should have been updated
      expect(john2).toBeTruthy()
      expect(john2.id).toBe(mockUserJon().id)
      expect(john2.passport.id).toBe(mockUserJon().passport.id)
      expect(john2.passport.displayName).toBe(`John v${v}.0`)

      // updatedAt should have been updated
      const updated2 = john2.updatedAt
      expect(updated2 > updated1).toBeTruthy()
    }
  })
})

//
// test data - returns new objects every time
//

function mockUserJon() {
  return JSON.parse(
    JSON.stringify({
      id: "johndoe@gmail.com",
      type: "user",
      passport: {
        id: "105223593689997423612",
        displayName: "John",
        name: { familyName: "Doe", givenName: "John" },
        provider: "google-one-tap",
        emails: [{ value: "johndoe@gmail.com" }],
        photos: [
          {
            value: "https://lh3.googleusercontent.com/a-/xyxy",
          },
        ],
      },
    })
  )
}

function mockUserJane() {
  return JSON.parse(
    JSON.stringify({
      id: "jane@doe.com",
      type: "user",
      passport: {
        id: "105223593689997423613",
        displayName: "Jane Doe",
        name: { familyName: "Doe", givenName: "Jane" },
        provider: "google-one-tap",
        emails: [{ value: "jane@doe.com" }],
        photos: [
          {
            value: "https://lh3.googleusercontent.com/a-/xxxx",
          },
        ],
      },
    })
  )
}
