//
// items.ts - interface for generic items stored
//

import assert from "assert"

export type ItemAttribute =
  | string
  | number
  | boolean
  | Date
  | ItemAttribute[]
  | { [key: string]: ItemAttribute }
  | null
  | undefined
  | any

/**
 * A generic item with tree structure and open ended attributes.
 * The purpose of this data structure is to simplify development and
 * have a single, general purpose, table storing all items with some
 * basic info like owner, type, dates, etc and the some attributes
 * which are stored and queried using JSON.
 */
export class Item {
  constructor() {}

  /** Unique id for item, eg. usr_xxx, crd_xxx, trn_xxx */
  id: string

  /** Item's parent id (optional) */
  parentId?: string

  /** Type of item, eg. 'user', 'card', 'transaction', etc... */
  type?: string

  /** Time when item was originally created */
  createdAt?: Date

  /** Time when item was last updated */
  updatedAt?: Date;

  /** Item's generic, open ended attributes */
  [key: string]: ItemAttribute

  //
  // static methods
  //

  /** Concrete class defines content type, eg. biomarker, topic, post, organization, etc... */
  public static get itemType(): string {
    throw new Error("Item.itemType - must be defined in subclass")
  }

  public static fromObject<T extends Item = Item>(obj: any, TCreator: new () => T): T {
    if (!obj.id) {
      assert(obj.id, "Item.fromObject - item is missing id field")
    }
    return Object.assign(new TCreator(), obj)
  }
}

export default Item
