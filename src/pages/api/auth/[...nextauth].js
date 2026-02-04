import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak"
import { escapeString } from "@/lib/escapeString";
const logger = require("../../../lib/logger");

export const authOptions = {
  /**
   * @Description Providers client id/secret
   */
  providers: [
    Keycloak({
      jwks_endpoint: `${process.env.INTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
      wellKnown: undefined,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: `${process.env.EXTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      authorization: {
        params: {
          prompt: "login"
        },
        url: `${process.env.EXTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`
      },
      token: `${process.env.INTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userInfo: `${process.env.INTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    })

  ],

  session: {
    maxAge: parseInt(process.env.SESSION_MAXAGE_SECONDS) || 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.commonName = escapeString(process.env.INTERCHANGE_PREFIX + token.email);
      return session;
    },
  },
  events: {
    async signIn(message) {
      const { email, name } = message.user;
      const { provider, type } = message.account;

      logger.child({ provider, type, name, email }).info("User logged in");
    },
    async signOut(message) {
      const { email, name } = message.token;

      logger.child({ name, email }).info("User logged out");
    },
  },
  logger: {
    error(code, metadata) {
      logger.error({ code, metadata });
    },
    warn(code) {
      logger.warn({ code });
    },
    debug(code) {
      logger.debug({ code });
    },
  },
  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
