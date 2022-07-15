/**
 * historyactivity.test.tsx
 * @jest-environment jsdom
 */

import React from "react"
import "@testing-library/jest-dom"
import { render, fireEvent, screen } from "@testing-library/react"
import { writeJson } from "../../lib/test/utilities"
import { fake_history } from "../../stories/helpers/fakedata"
import { HistoryActivity, getHistoryTrees, HISTORY_TITLE, HISTORY_TODAY, HISTORY_EARLIER } from "./historyactivity"

describe("historyactivity.tsx", () => {
  test("getHistoryTrees", () => {
    const trees = getHistoryTrees(fake_history)

    expect(trees).toBeTruthy()
    expect(trees.length).toBe(2)
    const todayTree = trees[0]
    const earlierTree = trees[1]

    // save for verification
    writeJson("./lib/test/artifacts/history.tree.json", todayTree)

    expect(todayTree.id).toBe("history/today")
    expect(todayTree.title).toBe(HISTORY_TODAY)
    expect(todayTree.type).toBe("history")
    expect(todayTree.icon).toBe("history")
    expect(todayTree.children.length).toBe(17)

    const todayFirst = todayTree.children[0]
    expect(todayFirst.id).toMatch(/history\/today\/sql_/)
    expect(todayFirst.title).toBe("Query 0 with a slightly long title that overflows")
    expect(todayFirst.type).toBe("query")
    expect(todayFirst.icon).toBe("query")
    expect(todayFirst.badge).toBeUndefined()
    expect(todayFirst.children).toBeUndefined()

    expect(earlierTree.id).toBe("history/earlier")
    expect(earlierTree.title).toBe(HISTORY_EARLIER)
    expect(earlierTree.type).toBe("history")
    expect(earlierTree.icon).toBe("bedtime")
    expect(earlierTree.children.length).toBe(83)
  })

  test("getHistoryTrees (empty)", () => {
    const trees = getHistoryTrees(undefined)

    expect(trees).toBeTruthy()
    expect(trees.length).toBe(1)
    const tree = trees[0]

    expect(tree.id).toBe(`history/today`)
    expect(tree.title).toBe(HISTORY_TODAY)
    expect(tree.type).toBe("history")
    expect(tree.icon).toBe("history")
    expect(tree.children).toHaveLength(0)
  })

  test("<HistoryActivity/> (single)", async () => {
    const handleCommand = jest.fn()
    const fake_item = fake_history[0]

    const { container, getByText } = render(
      <HistoryActivity
        id="act_history"
        title={HISTORY_TITLE}
        icon="history"
        queries={[fake_item]}
        onCommand={handleCommand}
      />
    )

    expect(getByText(HISTORY_TITLE)).toBeTruthy()
    expect(getByText(HISTORY_TODAY)).toBeTruthy()

    // item should be visible at first
    let treeItems = await container.getElementsByClassName("TreeItem-root")
    expect(treeItems).toHaveLength(2)
    let item = await screen.findByText(fake_item.title)
    expect(item).toBeTruthy()

    // click on item, should raise an openQuery command
    fireEvent.click(item)
    expect(handleCommand).toHaveBeenCalledTimes(1)
    let itemCommand = handleCommand.mock.calls[0][1]
    expect(itemCommand.command).toBe("openQuery")
    expect(itemCommand.args).toBe(fake_item)

    // extract to command buttons, open and delete
    treeItems = await container.getElementsByClassName("TreeItem-root")
    expect(treeItems).toHaveLength(2)

    // click deleteHistory on folder
    let folderCommands = await treeItems[0].getElementsByClassName("TreeItem-commandIcon")
    expect(folderCommands).toHaveLength(1)
    fireEvent.click(folderCommands[0])
    expect(handleCommand).toHaveBeenCalledTimes(2)
    itemCommand = handleCommand.mock.calls[1][1]
    expect(itemCommand.command).toBe("deleteHistory")
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

    // click deleteHistory on single item
    fireEvent.click(itemCommands[1])
    expect(handleCommand).toHaveBeenCalledTimes(4)
    itemCommand = handleCommand.mock.calls[3][1]
    expect(itemCommand.command).toBe("deleteHistory")
    expect(itemCommand.args.queries).toBeInstanceOf(Array)

    // click on folder, close item
    const folder = getByText(HISTORY_TODAY)
    expect(folder).toBeInTheDocument()
    fireEvent.click(folder)

    // item NOT should be visible
    item = screen.queryByText(fake_item.title)
    expect(item).toBeFalsy()
  })
})
