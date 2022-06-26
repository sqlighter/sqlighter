//
// fakedata.test.ts - not really a test, just a fake data generator
//

import { faker } from "@faker-js/faker"
import fs from "fs/promises"

async function generateFakerJson(specs, filename, rows = 3000) {
  console.assert(specs.values.length == specs.columns.length)
  const rowValues: any[] = []
  for (let i = 0; i < rows; i++) {
    const row = specs.values.map((callable) => callable())
    rowValues.push(row)
  }
  specs.values = rowValues
  const js = "const data = " + JSON.stringify(specs, null, "\t") + "\n\nexport default data\n"
  await fs.writeFile(filename, js)
}

describe("fakedata.test.ts", () => {
  test("fakeTest", async () => {
    //
  })

  /*
  test("generateData (customers.json)", async () => {
    await generateFakerJson(
      {
        sql: "select * from customers",
        columns: [
          "id",
          "firstName",
          "lastName",
          "jobTitle",
          "companyName",
          "streetAddress",
          "city",
          "state",
          "phoneNumber",
          "createdOn",
        ],
        values: [
          () => `usr_${faker.random.alphaNumeric(12)}`,
          faker.name.firstName,
          faker.name.lastName,
          faker.name.jobTitle,
          faker.company.companyName,
          faker.address.streetAddress,
          faker.address.city,
          faker.address.state,
          faker.phone.phoneNumber,
          () => faker.date.between("2000-01-01", new Date()),
        ],
      },
      "./stories/data/customers.js"
    )
  })
*/
})
