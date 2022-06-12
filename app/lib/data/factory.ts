//
// factory.ts
//

import { DataConnection, DataConfig, DataError } from "../data/connections"
import { SqliteDataConnection, SQLITE3_CLIENT_ID } from "../data/clients/sqlite"
// more client drivers...

export class DataConnectionFactory {
  /** Create a data connection from its configuration */
  public static create(configs: DataConfig): DataConnection {
    switch (configs.client) {
      case SQLITE3_CLIENT_ID:
        return new SqliteDataConnection(configs)
    }
    throw new DataError(`DataConnectionFactory.create - can't find client '${configs.client}'`, { configs })
  }
}
