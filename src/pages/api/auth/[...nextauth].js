import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
  /**
   * @Description Providers client id/secret
   */
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],

  /**
   * @Description Secret used to encrypt JWT
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * @Description Extend the Session object
   */
  callbacks: {
    async session({ session, token }) {
      session.user.commonName = process.env.INTERCHANGE_PREFIX + token.email;

      return session;
    },
  },

  /**
   * @Description Add custom pages for Auth routes
   */
  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
