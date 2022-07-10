//
// client.ts - client only utility methods
//

import { formatDistance, differenceInMilliseconds } from "date-fns"

//
// math
//

/** Rounds number to two decimal digits at most */
export function round(value: number, digits: number = 2) {
  return parseFloat(value.toFixed(digits))
}

//
// I/O
//

/** Returns the readable stream associated with given file or handle */
export async function getStream(file?: File | FileSystemFileHandle) {
  try {
    // reading FileSystemFileHandle? get the actual file
    if (file instanceof FileSystemFileHandle) {
      const actualFile = await file.getFile()
      return actualFile.stream()
    }
  } catch (exception) {
    // FileSystemFileHandle is not defined when running in node.js enviroment
    if (!(exception instanceof ReferenceError)) {
      throw exception
    }
  }
  if (file instanceof File) {
    return file.stream()
  }
}

//
// formatting
//

/**
 * Returns time distance in seconds
 * @param start Start date
 * @param end End date, will use now if not specified
 */
export function formatSeconds(start: Date, end?: Date): string {
  if (!end) {
    end = new Date()
  }
  const elapsedMs = differenceInMilliseconds(end, start)
  return (elapsedMs / 1000).toLocaleString() + " s"
}

/**
 * Returns human readable distance between dates, eg. a week ago
 * @param start Start date
 * @param end End date, will use now if not specified
 * @param showMs True if should show elapsed seconds with precision, eg. 0.130 s
 * @see https://date-fns.org/v2.28.0/docs/formatDuration
 */
export function formatDuration(start: Date, end?: Date, showMs?: boolean): string {
  if (!end) {
    end = new Date()
  }
  if (showMs) {
    const elapsedMs = differenceInMilliseconds(end, start)
    if (elapsedMs < 120 * 1000) {
      return (elapsedMs / 1000).toLocaleString() + " s"
    }
  }
  return formatDistance(start, end, { includeSeconds: true })
}
