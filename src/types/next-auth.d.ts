import { DefaultSession } from "next-auth";

// セッションの user オブジェクトにDBのユーザーIDを追加するための型拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
