//
// search.tsx - a view showing search results
//

import useSWR from "swr"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"

import { BiomarkerListItem, ContentListItem, TopicListItem, ArticleListItem, ReferenceListItem } from "./listitems"

interface SearchProps {
  /** The query string */
  search: string
}

/** Returns a single search result as a list item formatted for the type of entry */
function SearchResult(props) {
  switch (props.type) {
    case "article":
      return <ArticleListItem item={props.item} />
    case "biomarker":
      return <BiomarkerListItem item={props.item} />
    case "topic":
      return <TopicListItem item={props.item} />
    case "reference":
      return <ReferenceListItem item={props.item} />
    default:
      return <ContentListItem item={props.item} />
  }
}

export function SearchResults({ search }: SearchProps) {
  // fetch list of search results with basic item info, item type, confidence
  const { data } = useSWR(`/api/search?q=${search}`, (apiUrl: string) => fetch(apiUrl).then((res) => res.json()), {
    dedupingInterval: 2000,
  })

  if (!data) {
    return <Typography variant="overline">Loading...</Typography>
  }

  if (data?.data?.length < 1) {
    return <Typography variant="overline">No results</Typography>
  }

  return (
    <>
      <Typography variant="overline">{`${data.data.length} results`}</Typography>
      <List>
        {data.data.map((result) => (
          <SearchResult {...result} />
        ))}
      </List>
    </>
  )
}
