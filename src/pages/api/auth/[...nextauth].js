import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  /**
   * @Description Providers client id/secret
   */
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  /**
   * @Description Secret used to encrypt JWT
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * @Description Add custom pages for Auth routes
   */
  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
