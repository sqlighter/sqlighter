//
// analytics.ts - track anonymized events in google analytics
//

/**
 * Track anonymized application events using Google Analytics
 * @param eventName Event name, eg. 'login', 'open_database', 'run_query'
 * @param eventParams Additional event parameters
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */
export function trackEvent(eventName: string, eventParams: Gtag.EventParams | Gtag.CustomParams) {
  if (gtag) {
    gtag("event", eventName, { category: "app", ...eventParams })

    // if the event has an xxx_elapsed field, for example 'query_elapsed' we report 
    // the event separately as a performance event with elapsed millisecs as its value
    if (eventParams) {
      for (const key in eventParams) {
        if (key.endsWith("_elapsed")) {
          gtag("event", key, { category: "performance", value: eventParams[key] }) // elapsed ms
        }
      }
    }
  } else {
    console.warn(`trackEvent(${eventName}) - gtag undefined`)
  }
}
