import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NextAuth v5 (Auth.js) のセッションクッキー名。
// 開発(HTTP)では通常名、本番(HTTPS)では __Secure- プレフィックスが付く。
const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

// 未ログイン時のアクセス権限ガード。
// 認証APIやログインページ以外のページへは、ログインセッションが
// ない場合はログインページへリダイレクトする。
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // API・認証関連・ログインページはそのまま通す
  // （APIが求権を制御するのはAPI側の責務なので、ここでは404/401委譲する）
  if (
    pathname.startsWith("/api") ||
    pathname === "/auth/login" ||
    pathname.startsWith("/auth/login/")
  ) {
    return NextResponse.next();
  }

  // ログインセッションクッキーが無ければログインページへ遷移する
  const hasSession = SESSION_COOKIE_NAMES.some((name) =>
    request.cookies.has(name)
  );
  if (!hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    // ログイン後に元のページへ戻れるように callbackUrl を保持する
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // ページとムービーを対象に、API・静的アセット・画像は除外する
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};