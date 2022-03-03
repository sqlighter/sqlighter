//
// props.ts - helper functions for dealing with next.js getStaticProps and getStaticPaths methods
//

import { Article } from "./articles"
import { Biomarker } from "./biomarkers"
import { Organization } from "./organizations"
import { Topic } from "./topics"

/**
 * Strips an item down to a basic object so it can be used by getStaticProps in next.js
 * @param item A content item that should be made serializable for next.js
 * @param expandBiomarkers True if item.biomarkers should be expanded from a list of biomarkerId to actual contents
 * @returns A regular dictionary object
 */
export async function getSerializableContent(
  item: any,
  expandBiomarkers: boolean = false,
  expandArticles: boolean = false
) {
  const serialized = JSON.parse(JSON.stringify(item))

  // add organizations to references so we can show logos, etc
  if (serialized.references) {
    for (const reference of serialized.references) {
      if (reference.url && !reference.organization) {
        const organization = await Organization.getOrganizationFromUrl(reference.url)
        if (organization) {
          reference.organization = organization.id
        }
      }
    }
  }

  // expand biomarker references if requested
  if (expandBiomarkers && serialized.biomarkers) {
    const biomarkers = []
    for (const biomarkerId of serialized.biomarkers) {
      const biomarker = await Biomarker.getBiomarker(biomarkerId)
      if (biomarker) {
        biomarkers.push(biomarker)
      } else {
        console.error(`getSerializableContent - ${item.id}, biomarker: ${biomarkerId} not found`, item)
      }
    }
    serialized.biomarkers = await getSerializableContent(biomarkers)
  }

  // expand article references if requested
  if (expandArticles && item.articles) {
    const articles = []
    for (const articleId of serialized.articles) {
      const article = await Article.getContent(articleId)
      if (article) {
        articles.push(article)
      } else {
        console.error(`getSerializableContent - ${item.id}, article: ${articleId} not found`, item)
      }
    }
    serialized.articles = await getSerializableContent(articles)
  }

  return serialized
}

//
// various contents processed for props
//

export async function getSerializableTopics(locale) {
  // TODO filter topics by published status, sort by sort field or title
  let topics = Object.values(await Topic.getContents(locale))
  topics = await Promise.all(
    topics.map(async (topic) => {
      const serialized = await getSerializableContent(topic, false)
      return { ...serialized, url: `/topics/${topic.id}` }
    })
  )
  return topics
}

/** Returns a list of available biomarkers */
export async function getSerializableBiomarkers(locale) {
  // TODO could group based on topic group or sort order, etc
  let biomarkers = Object.values(await Biomarker.getBiomarkers(locale))
  biomarkers = biomarkers.filter((b) => b.status == "published")
  biomarkers = biomarkers.sort((a, b) => (a.title < b.title ? -1 : 1))
  biomarkers = await Promise.all(biomarkers.map(async (biomarker) => await getSerializableContent(biomarker, false)))
  return biomarkers
}

/** Returns a list of available articles */
export async function getSerializableArticles(locale) {
  // TODO could sort based on publicationDate, relevance, etc.
  let articles: Article[] = Object.values(Article.getContents(locale))
  articles = articles.filter((b) => b.status == "published")
  articles = articles.sort((a, b) => (a.title < b.title ? -1 : 1))
  articles = await Promise.all(
    articles.map(async (article) => {
      const serialized = await getSerializableContent(article, false)
      return { ...serialized, url: `/articles/${article.id}` }
    })
  )
  return articles
}
