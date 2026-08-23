import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Auth.js (NextAuth v5) の設定。
// Googleアカウントでのログインを許可し、初回ログイン時に
// PrismaAdapter 経由で User / Account レコードをDBに自動作成する。
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET 環境変数を自動で読み込む
    Google,
  ],
  // ローカル開発やプロキシ環境下でもホストを信頼する（本番では適切にホストを制限すること）
  trustHost: true,
  callbacks: {
    // セッションにDB上のユーザーIDを含める（クライアントやAPIで利用するため）
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
