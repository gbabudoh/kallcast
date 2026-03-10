import NextAuth from 'next-auth';
import type { NextAuthConfig, Session, User } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './db';
import { AuthUser } from '@/types/user';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email as string } 
          });
          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profileImage: user.profileImage,
            isVerified: user.isVerified,
            stripeOnboardingComplete: user.stripeOnboardingComplete,
          } as User;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.profileImage = user.profileImage;
        token.isVerified = user.isVerified;
        token.stripeOnboardingComplete = user.stripeOnboardingComplete;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.profileImage = token.profileImage;
        session.user.isVerified = token.isVerified;
        session.user.stripeOnboardingComplete = token.stripeOnboardingComplete;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }

  interface User extends AuthUser {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends AuthUser {
    sub?: string;
  }
}
