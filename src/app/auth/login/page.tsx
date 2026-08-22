//ログイン

"use client";

import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            ログイン
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-6 text-base font-semibold"
          >
            Googleでログイン
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}