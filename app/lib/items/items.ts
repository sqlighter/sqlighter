//
// items.ts - interface for generic items stored
//

import assert from "assert"
import { generateId } from "../shared"

/** Item entries are basic values arranged in dictionaries and arrays */
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

/** Additional metadata for an object */
export class Metadata {
  constructor(args?: any) {
    if (args) {
      Object.assign(this, args)
    }
  }

  /** Metadata values can be accessed by property name */
  [key: string]: ItemAttribute
}

/**
 * A generic item with tree structure and open ended attributes.
 * The purpose of this data structure is to simplify development and
 * have a single, general purpose, table storing all items with some
 * basic info like owner, type, dates, etc and the some attributes
 * which are stored and queried using JSON.
 */
export class Item {
  constructor() {}

  /** Unique id for item, eg. usr_xxx, sql_xxx, trn_xxx */
  id: string

  /** Item's parent id (optional) */
  parentId?: string

  /** Type of item, eg. 'user', 'query', 'transaction', etc... */
  type?: string

  /** Time when item was originally created (ISO date string) */
  createdAt?: string

  /** Time when item was last updated (ISO date string) */
  updatedAt?: string;

  /** Item's generic, open ended attributes */
  [key: string]: ItemAttribute

  //
  // static methods
  //

  /** Concrete class defines content type, eg. biomarker, topic, post, organization, etc... */
  public static get itemType(): string {
    throw new Error("Item.itemType - must be defined in subclass")
  }

  /** Id prefix to be used for this kind of items */
  public static get itemPrefix(): string {
    throw new Error("Item.itemPrefix - must be defined in subclass")
  }

  /** Generate a random id that is crytographically secure */
  public static generateId(): string {
    return generateId(this.itemPrefix)
  }

  public static fromObject<T extends Item = Item>(obj: any, TCreator: new () => T): T {
    if (!obj.id) {
      assert(obj.id, "Item.fromObject - item is missing id field")
    }
    return Object.assign(new TCreator(), obj)
  }
}

export default Item
