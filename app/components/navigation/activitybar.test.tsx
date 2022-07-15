/**
 * activitybar.test.tsx
 * @jest-environment jsdom
 */

import React from "react"
import "@testing-library/jest-dom"
import { render, fireEvent } from "@testing-library/react"
import { fake_user_mickey, fake_activities } from "../../stories/helpers/fakedata"
import { ActivityBar } from "./activitybar"

function renderActivityBar(user?) {
  const handleCommand = jest.fn()
  const { container, getByText, queryByText } = render(
    <ActivityBar activityId="act_database" activities={fake_activities} user={user} onCommand={handleCommand} showSettings={true} />
  ) 
  return { container, getByText, queryByText, handleCommand}
}

describe("activitybar.tsx", () => {
  test("<ActivityBar/> (no user)", async () => {
    const { container, handleCommand } = renderActivityBar()
    const buttons = container.getElementsByClassName("ActivityBar-button")
    expect(buttons).toHaveLength(3)

    // click home
    fireEvent.click(buttons[0])
    expect(handleCommand).toHaveBeenCalledTimes(1)
    let itemCommand = handleCommand.mock.calls[0][1]
    expect(itemCommand.command).toBe("openHome")
    expect(itemCommand.args?.user).toBeUndefined()

    // click settings
    fireEvent.click(buttons[1])
    expect(handleCommand).toHaveBeenCalledTimes(2)
    itemCommand = handleCommand.mock.calls[1][1]
    expect(itemCommand.command).toBe("openSettings")
    expect(itemCommand.args?.user).toBeUndefined()

    // click user (signed out)
    fireEvent.click(buttons[2])
    expect(handleCommand).toHaveBeenCalledTimes(3)
    itemCommand = handleCommand.mock.calls[2][1]
    expect(itemCommand.command).toBe("signin")
    expect(itemCommand.args?.user).toBeUndefined()
  })

  test("<ActivityBar/> (with user)", async () => {
    const { container, handleCommand, getByText, queryByText } = renderActivityBar(fake_user_mickey)

    // sign out menu is closed
    expect(queryByText("Sign out")).toBeNull()

    // clicking avatar opens menu
    const button = container.getElementsByClassName("ActivityBar-user")[0]
    fireEvent.click(button)
    expect(handleCommand).toHaveBeenCalledTimes(0)

    // sign out menu is open
    expect(queryByText("Sign out")).toBeTruthy()

    // clicking sign out calls onCommand
    const signoutMenu = getByText("Sign out")
    fireEvent.click(signoutMenu)
    expect(handleCommand).toHaveBeenCalledTimes(1)
    let signoutCommand = handleCommand.mock.calls[0][1]
    expect(signoutCommand.command).toBe("signout")
    expect(signoutCommand.args.user).toBe(fake_user_mickey)
  })
})
