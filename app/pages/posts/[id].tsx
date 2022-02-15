//
// /pages/posts/[id].tsx
//

import Head from "next/head"
import { GetStaticProps, GetStaticPaths } from "next"
import utilStyles from "../../styles/utils.module.css"
import Typography from "@mui/material/Typography"

import { Section } from "../../components/section"
import Layout from "../../components/layout"
import Date from "../../components/date"
import { getAllPostIds, getPostData } from "../../lib/posts"

interface PostProps {
  postData: {
    title: string
    date: string
    contentHtml: string
  }
}

export default function Post({ postData }: PostProps) {
  return (
    <Layout title="Blog">
      <article>
        <Section title={postData.title} subtitle={<Date dateString={postData.date} />} large>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </Section>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string)
  return {
    props: {
      postData,
    },
  }
}
