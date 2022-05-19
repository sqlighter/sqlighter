//
// connections.ts - base class for data connections that can provide data, schemas, etc.
//

/** Configuration used to connect with data source */
export interface DataConnectionConfigs {
  // TODO use knex.js format or similar

  /** Binary buffer containing the actual database data, eg. sqlite */
  buffer?: Buffer
}


export abstract class DataConnection {
  /** Configurations used to open this data connection */
  protected _configs: DataConnectionConfigs

  /** Concrete classes only */
  protected constructor(configs: DataConnectionConfigs) {
    this._configs = configs
  }
}
