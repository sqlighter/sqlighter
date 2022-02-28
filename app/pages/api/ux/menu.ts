//
// menu.ts - returns list of items that should be shown in the navigation menu
//

import nextConnect from "next-connect"
import { NextApiRequest, NextApiResponse } from "next"

import auth from "../../../middleware/auth"
import { Biomarker } from "../../../lib/biomarkers"
import { Topic } from "../../../lib/topics"
import { DEFAULT_LOCALE } from "../../../lib/contents"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.use(auth).get((req, res) => {
  const user = (req as any).user
  const locale = (req.query.locale as string) || DEFAULT_LOCALE

  let items: any = [
    {
      id: "journal",
      type: "command",
      title: "Journal",
      url: "/journal",
      imageUrl: "icon://assignment",
    },
    {
      id: "library",
      type: "command",
      title: "Library",
      url: "/library",
      imageUrl: "icon://local_library",
    },
    {
      id: "profile",
      type: "command",
      title: "Profile",
      url: "/profile",
      imageUrl: "icon://person_outline",
    },
  ]

  // TODO App / Personalized menu #28
  /*
  items.push({
    id: "topics",
    type: "section",
    title: "Topics",
    url: "/topics",
  })
  const topics = [
    "inflammation-group",
    "iron-group",
    "lipid-group",
    "liver-enzymes-group",
    "platelet-group",
    "sugar-group",
  ]
  for (const topicId of topics) {
    const topic = Topic.getContent(topicId, locale)
    if (topic) {
      items.push({
        id: topic.id,
        type: "topic",
        title: topic.title,
        description: topic.description,
        url: `/topics/${topicId}`,
        imageUrl: topic.imageUrl
//        imageUrl: "icon://assignment",
      })
    } else console.error(`menu.ts - topic '${topicId}' was not found`)
  }

  const biomarkers = ["cholesterol", "glucose", "rbc"]
  for (const biomarkerId of biomarkers) {
    const biomarker = Biomarker.getBiomarker(biomarkerId, locale)
    if (biomarker) {
      items.push({
        id: biomarker.id,
        type: "biomarker",
        title: biomarker.title,
        description: biomarker.description,
        url: `/biomarkers/${biomarkerId}`,
//        imageUrl: biomarker.imageUrl,
        imageUrl: "icon://assignment"
      })
    } else console.error(`menu.ts - biomarker '${biomarkerId}' was not found`)
  }
*/

  res.json({ data: items, metadata: { locale, user: user?.id } })
})

export default handler
