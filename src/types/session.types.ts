import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: string;
      estado: string;
    } & DefaultSession["user"];
  }

  interface User {
    rol?: string;
    estado?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    rol?: string;
    estado?: string;
  }
}

export type UserRol = "administrador" | "operador" | "consulta";
