//
// /records/[recordId].tsx - biomarker detail page
//

import { GetServerSidePropsContext } from "next"
import { ContentPage } from "../../components/contentpage"
import { Biomarker } from "../../lib/items/biomarkers"
import { getSerializableContent } from "../../lib/props"
import { ItemsTable } from "../../lib/database"

export default function RecordPage({ item }: { item: Biomarker }) {
  if (!item.title) {
    item.title = item.id
  }

  // TODO prepare contents before passing to content page

  return <ContentPage item={item} />
}

/** Dynamic properties from /records/recordId */
export async function getServerSideProps({ req, params, locale }: GetServerSidePropsContext) {
  const itemsTable = new ItemsTable()
  const recordId = params.recordId as string
  const record = await itemsTable.selectItem(recordId)
  const item = await getSerializableContent(record, true, true)
  console.debug('%s - recordId: %s', req.url, recordId, item)

  return {
    // will be passed to the page component as props
    props: { item }, 
  }
}
