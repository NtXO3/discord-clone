import { Session, User } from "next-auth"
import { JWT } from "next-auth/jwt";

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface Session {
    /** This is an example. You can find me in types/next-auth.d.ts */
    user: {
      uid: string | undefined;
    } & User;
    token: JWT;
  }
  interface User {
    id: string;
    email: string;
  }
}