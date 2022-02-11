import * as React from "react"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"

import Head from "next/head"
import Layout from "../components/layout"
import utilStyles from "../styles/utils.module.css"
import { getSortedPostsData } from "../lib/posts"
import Link from "next/link"
import Date from "../components/date"
import { GetStaticProps, GetServerSideProps } from "next"

import { Biomarker } from "../lib/biomarkers"

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
    <Layout home title="Browse">
      <section className={utilStyles.headingMd}>Browse</section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
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
        </ul>

        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Biomarkers ({locale})</h2>
          <ul className={utilStyles.list}>
            {biomarkers &&
              biomarkers.map((biomarker) => (
                <li className={utilStyles.listItem} key={biomarker.id}>
                  <Link href={`/biomarkers/${biomarker.id}`}>
                    <a>{biomarker.title}</a>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </section>
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
