//
// props.ts - helper functions for dealing with next.js getStaticProps and getStaticPaths methods
//

import { Biomarker } from "./biomarkers"

/**
 * Strips an item down to a basic object so it can be used by getStaticProps in next.js
 * @param item A content item that should be made serializable for next.js
 * @param expandBiomarkers True if item.biomarkers should be expanded from a list of biomarkerId to actual contents
 * @returns A regular dictionary object
 */
 export function getSerializableContent(item: any, expandBiomarkers: boolean = false) {
  const serialized = JSON.parse(JSON.stringify(item))

  if (expandBiomarkers && item.biomarkers) {
    const biomarkers = []
    for (const biomarkerId of serialized.biomarkers) {
      const biomarker = Biomarker.getBiomarker(biomarkerId)
      if (biomarker) {
        biomarkers.push(biomarker)
      } else {
        console.error(`getSerializableContent - ${item.id}, biomarker: ${biomarkerId} not found`, item)
      }
    }
    serialized.biomarkers = getSerializableContent(biomarkers)
  }

  return serialized
}
