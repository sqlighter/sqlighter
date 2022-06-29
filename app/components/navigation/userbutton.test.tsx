/**
 * userbutton.test.tsx
 * @jest-environment jsdom
 */

import React from "react"
import "@testing-library/jest-dom"
import { render, fireEvent } from "@testing-library/react"
import { fake_user_mickey } from "../../stories/helpers/fakedata"
import { UserButton } from "./userbutton"

describe("userbutton.tsx", () => {
  test("<UserButton/> (no user)", async () => {
    const handleCommand = jest.fn()
    const { container } = render(<UserButton user={undefined} onCommand={handleCommand} />)

    const button = container.getElementsByClassName("UserButton-root")[0]
    fireEvent.click(button)
    expect(handleCommand).toHaveBeenCalledTimes(1)
    let itemCommand = handleCommand.mock.calls[0][1]
    expect(itemCommand.command).toBe("signin")
    expect(itemCommand.args?.user).toBeUndefined()
  })

  test("<UserButton/> (with user)", async () => {
    const handleCommand = jest.fn()
    const { container, getByText, queryByText } = render(<UserButton user={fake_user_mickey} onCommand={handleCommand} />)

    // sign out menu is closed
    expect(queryByText("Sign out")).toBeNull()

    // clicking avatar opens menu
    const button = container.getElementsByClassName("UserButton-root")[0]
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
