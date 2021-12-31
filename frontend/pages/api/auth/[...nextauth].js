import NextAuth from "next-auth"
import AppleProvider from "next-auth/providers/apple"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"

const options = {
  providers: [
    // OAuth authentication providers...
    /*
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    }),
    */
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Passwordless / email sign in
    /*
    EmailProvider({
      server: process.env.MAIL_SERVER,
      from: 'NextAuth.js <no-reply@example.com>'
    }),*/
  ],
 // database: process.env.NEXT_PUBLIC_DATABASE_URL,
  secret: "+gtNMHCJPom2TY/xMITimlselSkoZjg9wOMUgJ1qh1Q=",

  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session, user) => {
      console.log(`auth.js[session] - session: ${session}, user: ${user}`);
      session.jwt = user.jwt;
      session.id = user.id;
      return Promise.resolve(session);
    },
    jwt: async (token, user, account) => {
      user = token.user
      account = token.account
      var accessToken = account?.access_token
      console.log(`auth.js[jwt] - token: ${token}, user: ${user}, account: ${account}, access_token: ${accessToken}`);
      console.log(token);
      const isSignIn = user ? true : false;
      if (isSignIn) {
        var callbackUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${account.provider}/callback?access_token=${accessToken}`
        console.log(`auth.js[jwt] - callbackUrl: ${callbackUrl}`);
        const response = await fetch(callbackUrl);
        const data = await response.json();
        console.log(`auth.js[jwt] - response: ${data}`);
        console.log(data);
        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      return Promise.resolve(token);
    },
  },
}

const Auth = (req, res) =>
  NextAuth(req, res, options);

export default Auth;