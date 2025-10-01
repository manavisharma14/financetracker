// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { createDefaultCategories } from "./createDefaultCategories";

declare module "next-auth" {
    interface Session {
        user : {
            id : string;
            email : string;
        } & DefaultSession["user"];
    }
    interface User {
        id : string;
        email : string;
    }
}



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",  
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;       
        token.email = user.email; 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
    
        // 👇 ensure categories exist
        await createDefaultCategories(session.user.id);
      }
      return session;
    },
  },
};