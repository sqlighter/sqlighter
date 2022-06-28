/**
 * Not a real component, just an example of how to test for different things
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://sqlighter.com/"}
 */

import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { Example } from "./example"
import { prettyBytes } from "../../lib/shared"

// References
// https://testing-library.com/
// https://testing-library.com/docs/queries/about/
// https://testing-library.com/docs/example-react-context
// https://jestjs.io/docs/expect
// https://reactjs.org/docs/testing-recipes.html

describe("example.tsx", () => {
  // TODO figure out why @jest-environment-options is ignored
  /*
  test("testLocation", () => {
    console.debug(window.location)
    expect(window.location.href).toBe("https://sqlighter.com/")
  })
*/
  test("testProps", () => {
    let component
    render(<Example name="John" />)

    // find by role (preferred)
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles
    component = screen.getByRole("button")
    expect(component).toHaveTextContent("John")

    // find by content
    component = screen.getByText("John")
    expect(component).toHaveTextContent("John")

    // find by root class
    component = document.querySelector(".Example-root")
    expect(component).toHaveTextContent("John")
  })

  test("testEvents", () => {
    const mockCallback = jest.fn()
    render(<Example name="Jim" onCommand={mockCallback} />)

    const component: any = document.querySelector(".Example-root")
    fireEvent.click(component)
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith(expect.anything(), {
      command: "clicked",
      args: {
        name: "Jim",
      },
    })
  })

  test("testMethod", () => {
    let size = 300
    expect(prettyBytes(size)).toBe("300 bytes")
    expect(prettyBytes(size, "en-US")).toBe("300 bytes")
    expect(prettyBytes(size, "it-IT")).toBe("300 bytes")
  })
})
