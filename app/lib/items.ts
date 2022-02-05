//
// items.ts - interface for generic items stored
//

/** A generic item with tree structure and open ended attributes */
export class Item {
  constructor() {}

  /** Unique id for item, eg. usr_xxx, crd_xxx, trn_xxx */
  id: string

  /** Item's parent id (optional) */
  parentId?: string

  /** Type of item, eg. 'user', 'card', 'transaction', etc... */
  type: string

  /** Time when item was originally created */
  createdAt?: Date

  /** Time when item was last updated */
  updatedAt?: Date

  /** Item's attributes */
  attributes?: any = {}
}

export default Item
