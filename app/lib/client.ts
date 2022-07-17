import * as dateFsn from "date-fns"

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
// Dates
//

/**
 * Return true if both dates are on the same day
 * @param date1 First Date as object or ISO string
 * @param date2 Second date, defaults to now()
 * @returns True if same day
 */
export function isSameDay(date1: Date | string, date2?: Date | string) {
  if (!date1) {
    console.warn(`isSameDay - should pass date1`, date1, date2)
    return false
  }
  if (typeof date1 === "string") {
    date1 = dateFsn.parseISO(date1)
  }
  if (!date2) {
    date2 = new Date() // local timezone
  } else {
    if (typeof date2 === "string") {
      date2 = dateFsn.parseISO(date2)
    }
  }
  return dateFsn.isSameDay(date1, date2)
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
