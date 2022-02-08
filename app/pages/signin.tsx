import React, { useContext } from "react"

import Layout from "../components/layout"
import Head from "next/head"
import Date from "../components/date"
import utilStyles from "../styles/utils.module.css"
import { GetStaticProps, GetStaticPaths } from "next"
import { Biomarker } from "../lib/biomarkers"
import Link from "next/link"
import Script from "next/script"

import { Context } from "../components/context"
import { SignInButton } from "../components/signingbutton"

// https://console.developers.google.com/apis/credentials/oauthclient/427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com?project=insieme2

export default function SigninPage({ biomarkers, locale }: { biomarkers: Biomarker[]; locale: string }) {
  const context = useContext(Context)

  return (
    <Layout>
      <Head>
        <title>Signin</title>
      </Head>
      <h2>Welcome</h2>
      <div>Signin to Biomarkers using Google SignIn</div>
      <SignInButton />
      {context.user && (
        <div>
          you are logged in as {context.user.attributes.passport.displayName}
          <img src={context.user.attributes.passport.photos[0].value} />
        </div>
      )}
    </Layout>
  )
}

/** Static properties from biomarkers.json */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  return {
    props: {
      biomarkers: "ciao",
      locale,
    },
  }
}
