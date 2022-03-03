//
// search.ts - search biomarkers, topics, articles, references
//

import nextConnect from "next-connect"
import { NextApiRequest, NextApiResponse } from "next"
import auth from "../../lib/auth/middleware"
import { Biomarker } from "../../lib/biomarkers"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.use(auth).get((req, res) => {
  // search query
  const query = req.query.q as string

  const biomarkers = Biomarker.searchBiomarkers(query)
  // TODO filter by item.status == published
  const results = biomarkers.map((r) => {
    return {
      type: "biomarker",
      confidence: r.confidence,
      item: {
        id: r.item.id,
        title: r.item.title,
        description: r.item.description,
      },
    }
  })

  // TODO personalized results from journal for authenticated user (req as any).user
  res.json({ data: results, metadata: { query } })
})

export default handler
