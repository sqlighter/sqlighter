//
// users.test.ts
//

import { ItemsTable } from "./database"
import { User } from "./users"

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe("users.ts", () => {
  // table used to test database
  let itemsTable: ItemsTable = null

  // start each test with an empty table
  beforeEach(async () => {
    itemsTable = new ItemsTable()
    await itemsTable.resetTable()

    // TODO a couple of tests fail if you remove this delay. probably issues with pooling or timing of deletes
    // await sleep(500)

    const u1 = await User.getUser(mockUserJon().id)
    expect(u1).toBeNull()
    const u2 = await User.getUser(mockUserJane().id)
    expect(u2).toBeNull()
  })

  test("getUser with missing user", async () => {
    const user = await User.getUser("missing@doe.com")
    expect(user).toBeNull()
  })

  test("getUser with valid email", async () => {
    let user = await User.getUser("johndoe@gmail.com")
    expect(user).toBeNull()

    itemsTable.insertItem(mockUserJon())
    itemsTable.insertItem(mockUserJane())

    user = await User.getUser(mockUserJon().id)
    expect(user.id).toStrictEqual(mockUserJon().id)
    expect(user.attributes.passport.displayName).toStrictEqual(mockUserJon().attributes.passport.displayName)

    user = await User.getUser(mockUserJane().id)
    expect(user.id).toStrictEqual(mockUserJane().id)
    expect(user.attributes.passport.displayName).toStrictEqual(mockUserJane().attributes.passport.displayName)
  })

  test("signinUser with new profile", async () => {
    let user = await User.signinUser(mockUserJon().attributes.passport)
    expect(user).toBeTruthy()
    expect(user.id).toStrictEqual(mockUserJon().id)
    expect(user.attributes.passport.displayName).toStrictEqual(mockUserJon().attributes.passport.displayName)
  })

  test("signinUser with existing profile", async () => {
    itemsTable.insertItem(mockUserJon())
    itemsTable.insertItem(mockUserJane())
    if (await User.getUser(mockUserJon().id)) {
      debugger
    }
    expect(await User.getUser(mockUserJon().id)).toBeTruthy()
    expect(await User.getUser(mockUserJane().id)).toBeTruthy()

    for (let i = 0; i < 5; i++) {
      // john already exists
      let user = await User.signinUser(mockUserJon().attributes.passport)
      expect(user).toBeTruthy()
      expect(user.id).toStrictEqual(mockUserJon().id)
      expect(user.attributes.passport.displayName).toStrictEqual(mockUserJon().attributes.passport.displayName)
    }
  })

  test("signinUser with missing email", async () => {
    const profile = mockUserJon().attributes.passport
    profile.emails = null

    let hasThrown = false
    try {
      await User.signinUser(profile)
    } catch (exception) {
      hasThrown = true
    }
    expect(hasThrown).toBeTruthy()
  })

  test("signinUser with updated profile", async () => {
    itemsTable.insertItem(mockUserJon())
    itemsTable.insertItem(mockUserJane())
    const john1 = await User.getUser(mockUserJon().id)
    expect(john1).toBeTruthy()
    const updated1 = john1.updatedAt.toISOString()

    // sleep so we can get different updatedAt timestamps even with second resolution
    await sleep(2000)

    for (let v = 2; v < 5; v++) {
      // signin user with changed profile information
      let updatedProfile = mockUserJon().attributes.passport
      updatedProfile.displayName = `John v${v}.0`
      const john2 = await User.signinUser(updatedProfile)

      // user profile should have been updated
      expect(john2).toBeTruthy()
      expect(john2.id).toBe(mockUserJon().id)
      expect(john2.attributes.passport.id).toBe(mockUserJon().attributes.passport.id)
      expect(john2.attributes.passport.displayName).toBe(`John v${v}.0`)

      // updatedAt should have been updated
      const updated2 = john2.updatedAt.toISOString()
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
      attributes: {
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
      },
    })
  )
}

function mockUserJane() {
  return JSON.parse(
    JSON.stringify({
      id: "jane@doe.com",
      type: "user",
      attributes: {
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
      },
    })
  )
}
