//
// library.tsx
//

import * as React from "react"
import Head from "next/head"
import Link from "next/link"
import { GetStaticProps, GetServerSideProps } from "next"
import utilStyles from "../styles/utils.module.css"

import List from "@mui/material/List"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { getSortedPostsData } from "../lib/posts"
import { Biomarker } from "../lib/biomarkers"
import Date from "../components/date"
import Layout from "../components/layout"
import { Section } from "../components/section"
import { BiomarkersList } from "../components/biomarkerslist"

interface BrowsePageProps {
  biomarkers: Biomarker[]

  posts: {
    date: string
    title: string
    id: string
  }[]

  locale: string
}

export default function BrowsePage({ biomarkers, posts, locale }: BrowsePageProps) {
  return (
    <Layout home title="Library">
      <Typography variant="overline">Articles</Typography>
      {posts &&
        posts.map(({ id, date, title }) => (
          <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
        ))}

      {biomarkers && <BiomarkersList title="Biomarkers" biomarkers={biomarkers} />}
    </Layout>
  )
}

/** Static properties from biomarkers */
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let biomarkers = Object.values(Biomarker.getBiomarkers(locale))
  //  console.log(biomarkers)

  //console.log(req.query)

  biomarkers = biomarkers.filter((b) => b.status == "published")
  biomarkers = biomarkers.sort((a, b) => (a.title < b.title ? -1 : 1))

  const serializable = biomarkers.map((b) => JSON.parse(JSON.stringify(b)))
  const posts = getSortedPostsData()

  return {
    props: {
      biomarkers: serializable,
      posts,
      locale,
    },
  }
}
