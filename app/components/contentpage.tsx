//
// contentpage.tsx - a content detail page used for topics, blogs, biomarkers
//

import Link from "next/link"
import { GetStaticProps, GetStaticPaths } from "next"

import React from "react"
import Box from "@mui/material/Box"
import List from "@mui/material/List"

import Layout from "./layout"
import { Content, ContentReference } from "../lib/contents"
import { ReferenceListItem } from "./listitems"
import { Section } from "./section"

interface ContentPageProps {
  /** Item that should be shown */
  item: Content
}

/** Shows a gallery of images with titles and optional subtitles arranged in tiles of variables sizes */
export function ContentPage({ item }: ContentPageProps) {
  const contentHtml = (item as any).contentHtml

  return (
    <Layout title={item.title} subtitle={item.description} back={true}>
<article id={item.id} title={item.title}>
        {contentHtml && (
          <section>
            <div className="markdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </section>
        )}
      </article>
      {item.references && (
        <Section title="References">
          <Box mb={2} />
          <List dense disablePadding>
            {item.references.map((ref) => (
              <ReferenceListItem key={(ref as ContentReference).url} reference={ref} />
            ))}
          </List>
        </Section>
      )}

    </Layout>
  )
}

