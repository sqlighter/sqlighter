//
//
//

import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import utilStyles from "../styles/utils.module.css"

import * as React from "react"

import { getSortedPostsData } from "../lib/posts"
import Layout from "../components/layout"
import Date from "../components/date"

interface BlogPageProps {
  // list of posts ordered by date
  posts: { date: string; title: string; id: string }[]
  // locale, eg en-US, it-IT
  locale: string
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Layout home title="Blog">
      <section>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {posts.map(({ id, date, title }) => (
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
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const posts = getSortedPostsData()
  return {
    props: {
      posts,
      locale,
    },
  }
}
