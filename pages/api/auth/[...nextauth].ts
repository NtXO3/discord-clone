import { db } from 'utils/firebase-config';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from "next-auth/providers/google";
import { generateUserTag } from 'utils';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID ?? "",
      clientSecret: process.env.CLIENT_SECRET ?? "",
    })
  ],
  callbacks: {
    async session ({ session, token }: SessionProps) {
      session.user.uid = token.sub;
      return session;
    },
    // @ts-ignore
    signIn: async ({ user }: SignInProps) => {
      if (!user) {
        return false
      }

      const userDoc = await getDoc(doc(db, "users", user.id))

      if (userDoc.exists()) {
        await updateDoc(doc(db, "users", user.id), {
          status: 'ONLINE'
        })
        return true;
      }

      const generatedTag = generateUserTag(user?.name ?? "")

      await setDoc(doc(db, "users", user.id), {
        name: user.name,
        tag: generatedTag,
        email: user.email,
        image: user.image,
        uid: user.id,
        status: 'ONLINE'
      })
      await updateDoc(doc(db, "servers", 'rQs1ZZSuK9z8cs1yrFKj'), {
        members: arrayUnion({
          role: 'member',
          uid: user.id,
        })
      })
      return true;
    },
  },
  pages: {
    signIn: '/login',
  }
}

export default NextAuth(authOptions);

type SignInProps = {
  user: User;
}

type SessionProps = {
  session: Session;
  token: JWT;
}