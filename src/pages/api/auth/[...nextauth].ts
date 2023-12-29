import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  hashedPassword: string | null;
  createdAt: Date;
  updatedAt: Date;
  favoriteIds: string | null;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string>,
        req?: any
      ): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일 또는 비밀번호 확인 해 주세요");
        }
        const user = await prisma.usertbl.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user?.hashedPassword) {
          throw new Error("이메일 확인 해 주세요");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("비밀번호를 확인 해 주세요");
        }
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          hashedPassword: user.hashedPassword,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          favoriteIds: user.favoriteIds,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
};

export default NextAuth(authOptions);
