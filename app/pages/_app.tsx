import Head from "next/head"
import Script from "next/script"
import "../styles/global.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="google-signin-client_id"
          content="427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com"
        />
      </Head>
      <Component {...pageProps} />
      <Script key="google-gsi" src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
    </>
  )
}
