/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://sqlighter.com/"}
 */

import React from "react"
import { render, fireEvent, waitFor, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { CommandIconButton } from "./commands"

describe("commands.tsx", () => {
  test("CommandIconButton - onCommand", () => {
    const command = {
      command: "openDatabase",
      title: "Open Database",
      icon: "database",
    }

    const mockCallback = jest.fn()
    render(<CommandIconButton command={command} onCommand={mockCallback} />)

    const component: any = document.querySelector(".CommandIconButton-root")
    fireEvent.click(component)
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith(expect.anything(), command)
  })
})
