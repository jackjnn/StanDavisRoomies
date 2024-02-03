import NextAuth, { type NextAuthOptions } from "next-auth";
import type { User } from "@/party/utils/auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID) {
  throw new Error("GITHUB_CLIENT_ID not defined in environment");
}

if (!GITHUB_SECRET) {
  throw new Error("GITHUB_CLIENT_SECRET not defined in environment");
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID not defined in environment");
}

if (!GOOGLE_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET not defined in environment");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    signIn(params) {
      return true;
    },

    session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          // username: token.username,
          // Adjust according to the information provided by Google
          username: token.email, // or any other identifier you prefer
        } as User,
      };
    },

    jwt({ token, profile, trigger }) {
      // const username =
      //   profile && "login" in profile ? profile.login : profile?.email;

      // Adjust as necessary based on Google profile information
      const email = profile?.email;

      if (trigger === "signIn") {
        // return { ...token, username };
        return { ...token, email };
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
