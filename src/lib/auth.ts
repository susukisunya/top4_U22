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
    Google,
  ],
  // ローカル開発やプロキシ環境下でもホストを信頼する（本番ではホストを制限すること）
  trustHost: true,
  callbacks: {
    // セッションにDB上のユーザーIDを含める
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
