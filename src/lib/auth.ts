import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDB } from "./db";

interface DBUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  plan?: string;
  scripts_this_month?: number;
  scripts_month_key?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const db = getDB();
        const user = db
          .prepare("SELECT * FROM users WHERE email = ?")
          .get(credentials.email) as DBUser | undefined;

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar_url || null,
          plan: user.plan || "free",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = (user as { image?: string | null }).image;
        token.plan = (user as { plan?: string }).plan || "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { image?: string | null }).image = token.image as string | null;
        (session.user as { plan?: string }).plan = token.plan as string;
      }
      return session;
    },
  },
};
