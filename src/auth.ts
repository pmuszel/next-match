import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";
 
//const prisma = new PrismaClient();


export const {handlers, auth, signIn, signOut} = NextAuth({
    callbacks: {
        async session({token, session}) {
            if(token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    ...authConfig,
})