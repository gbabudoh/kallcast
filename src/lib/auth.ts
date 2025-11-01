import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';
import { AuthUser } from '@/types/user';

export const { handlers, auth, signIn, signOut } = NextAuth({
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
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email });
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
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profileImage: user.profileImage,
            isVerified: user.isVerified,
            stripeOnboardingComplete: user.stripeOnboardingComplete,
          } as AuthUser;
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
    async jwt({ token, user }) {
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
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as 'learner' | 'coach';
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.profileImage = token.profileImage as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.stripeOnboardingComplete = token.stripeOnboardingComplete as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }

  interface User extends AuthUser {}
}
