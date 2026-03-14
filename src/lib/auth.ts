import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[auth] authorize called, email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("[auth] missing credentials");
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          console.log("[auth] DB lookup result:", user ? `found id=${user.id}` : "not found");

          if (!user) return null;

          console.log("[auth] password hash prefix:", user.password.slice(0, 7));

          const valid = await bcrypt.compare(credentials.password, user.password);
          console.log("[auth] bcrypt.compare result:", valid);

          if (!valid) return null;

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.avatarUrl || null,
            plan: user.plan || "free",
          };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
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
