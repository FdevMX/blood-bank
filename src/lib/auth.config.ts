import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Se llenan en auth.ts
} satisfies NextAuthConfig;