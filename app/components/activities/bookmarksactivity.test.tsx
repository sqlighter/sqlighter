/**
 * bookmarksactivity.test.tsx
 * @jest-environment jsdom
 */

import React from "react"
import "@testing-library/jest-dom"
import { render, fireEvent, screen } from "@testing-library/react"
import { writeJson } from "../../lib/test/utilities"
import { fake_bookmarks, fake_bookmark } from "../../stories/helpers/fakedata"
import { BookmarksActivity, getBookmarksTrees, BOOKMARKS_FOLDER, BOOKMARKS_TITLE } from "./bookmarksactivity"

describe("bookmarksactivity.tsx", () => {
  test("getBookmarksTrees", () => {
    const trees = getBookmarksTrees(fake_bookmarks)

    expect(trees).toBeTruthy()
    expect(trees.length).toBe(4)
    const tree = trees[0]

    // save for verification
    writeJson("./lib/test/artifacts/bookmarks.tree.json", tree)

    expect(tree.id).toBe("bookmarks/folder 2")
    expect(tree.title).toBe("Folder 2")
    expect(tree.type).toBe("bookmarks")
    expect(tree.icon).toBe("bookmark")
    expect(tree.children.length).toBe(25)
    const rootTitles = tree.children.map((c) => c.title).join(", ")
    expect(rootTitles).toBe(
      "Query 10 with a quite long title that overflows, Query 14 with a really long title that overflows, Query 18 with a slightly long title that overflows, Query 2 with a really long title that overflows, Query 22 with a quite long title that overflows, Query 26 with a really long title that overflows, Query 30 with a slightly long title that overflows, Query 34 with a quite long title that overflows, Query 38 with a really long title that overflows, Query 42 with a slightly long title that overflows, Query 46 with a quite long title that overflows, Query 50 with a really long title that overflows, Query 54 with a slightly long title that overflows, Query 58 with a quite long title that overflows, Query 6 with a slightly long title that overflows, Query 62 with a really long title that overflows, Query 66 with a slightly long title that overflows, Query 70 with a quite long title that overflows, Query 74 with a really long title that overflows, Query 78 with a slightly long title that overflows, Query 82 with a quite long title that overflows, Query 86 with a really long title that overflows, Query 90 with a slightly long title that overflows, Query 94 with a quite long title that overflows, Query 98 with a really long title that overflows"
    )

    const tables = tree.children[0]
    expect(tables.id).toBe("bookmarks/folder 2/sql_8ocd5ku1rk16c5ksb2_0")
    expect(tables.title).toBe("Query 10 with a quite long title that overflows")
    expect(tables.type).toBe("query")
    expect(tables.icon).toBe("query")
    expect(tables.badge).toBeUndefined()
    expect(tables.children).toBeUndefined()
  })

  test("getBookmarksTrees (empty)", () => {
    const trees = getBookmarksTrees(undefined)

    expect(trees).toBeTruthy()
    expect(trees.length).toBe(1)
    const tree = trees[0]

    expect(tree.id).toBe(`bookmarks/${BOOKMARKS_FOLDER.toLowerCase()}`)
    expect(tree.title).toBe(BOOKMARKS_FOLDER)
    expect(tree.type).toBe("bookmarks")
    expect(tree.icon).toBe("bookmark")
    expect(tree.children).toHaveLength(0)
  })

  test("<BookmarksActivity/> (single)", async () => {
    const handleCommand = jest.fn()

    const { container, getByText } = render(
      <BookmarksActivity
        id="act_bookmarks"
        title="Bookmarks"
        icon="bookmark"
        queries={[fake_bookmark]}
        onCommand={handleCommand}
      />
    )

    expect(getByText(BOOKMARKS_TITLE)).toBeTruthy()
    expect(getByText(BOOKMARKS_FOLDER)).toBeTruthy()

    // item should be visible at first
    let treeItems = await container.getElementsByClassName("TreeItem-root")
    expect(treeItems).toHaveLength(2)
    let item = await screen.findByText(fake_bookmark.title)
    expect(item).toBeTruthy()

    // click on item, should raise an openQuery command
    fireEvent.click(item)
    expect(handleCommand).toHaveBeenCalledTimes(1)
    let itemCommand = handleCommand.mock.calls[0][1]
    expect(itemCommand.command).toBe("openQuery")
    expect(itemCommand.args).toBe(fake_bookmark)

    // extract to command buttons, open and delete
    treeItems = await container.getElementsByClassName("TreeItem-root")
    expect(treeItems).toHaveLength(2)

    // click deleteBookmarks on folder
    let folderCommands = await treeItems[0].getElementsByClassName("TreeItem-commandIcon")
    expect(folderCommands).toHaveLength(1)
    fireEvent.click(folderCommands[0])
    expect(handleCommand).toHaveBeenCalledTimes(2)
    itemCommand = handleCommand.mock.calls[1][1]
    expect(itemCommand.command).toBe("deleteBookmarks")
    expect(itemCommand.args.queries).toBeInstanceOf(Array)

    // commands on bookmark item
    let itemCommands = await treeItems[1].getElementsByClassName("TreeItem-commandIcon")
    expect(itemCommands).toHaveLength(2)

    // click openQuery
    fireEvent.click(itemCommands[0])
    expect(handleCommand).toHaveBeenCalledTimes(3)
    itemCommand = handleCommand.mock.calls[2][1]
    expect(itemCommand.command).toBe("openQuery")
    expect(itemCommand.args.sql).toBeTruthy()

    // click deleteBookmarks on single item
    fireEvent.click(itemCommands[1])
    expect(handleCommand).toHaveBeenCalledTimes(4)
    itemCommand = handleCommand.mock.calls[3][1]
    expect(itemCommand.command).toBe("deleteBookmarks")
    expect(itemCommand.args.queries).toBeInstanceOf(Array)

    // click on folder, close item
    const folder = getByText(BOOKMARKS_FOLDER)
    expect(folder).toBeInTheDocument()
    fireEvent.click(folder)

    // item should not be visible
    item = await screen.queryByText(fake_bookmark.title)
    expect(item).toBeFalsy()
  })
})
