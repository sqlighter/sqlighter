import { NextPage } from "next"

interface Props {
  userAgent?: string
  user?: string
}

const Page: NextPage<Props> = ({ userAgent, user }) => (
  <main>
    Your user agent: {userAgent}
    <br />
    user: {user}
  </main>
)

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  return { userAgent, user: "me" }
}

export default Page
