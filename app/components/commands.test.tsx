/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://sqlighter.com/"}
 */

 import React from 'react'
 import {rest} from 'msw'
 import {setupServer} from 'msw/node'
 import {render, fireEvent, waitFor, screen} from '@testing-library/react'
 import '@testing-library/jest-dom'

 import { prettyBytes, prettyContentType } from "../lib/shared"

function Hello(props) {
  return <div className="Hello-root">{props.name}</div>
}

 describe("shared.ts", () => {
   test("prettyContentType", () => {
     expect(prettyContentType("application/pdf")).toBe("pdf")
     expect(prettyContentType("image/jpg")).toBe("jpg")
     expect(prettyContentType("video/mp4")).toBe("video")
   })
 
   test("prettyBytes", () => {
     let size = 300
     expect(prettyBytes(size)).toBe("300 bytes")
     expect(prettyBytes(size, "en-US")).toBe("300 bytes")
     expect(prettyBytes(size, "it-IT")).toBe("300 bytes")
 


     expect(window.location.href).toBe('https://sqlighter.com/');
   })

   test("testLocation", () => {
    expect(window.location.href).toBe('https://sqlighter.com/');
  })

   test("testProps", () => {
    render(<Hello name="John" />)
    

    let component = screen.getByText("John")
    expect(component).toHaveTextContent("John2")
    

    expect(window.location.href).toBe('https://sqlighter.com/');
  })

  })
 