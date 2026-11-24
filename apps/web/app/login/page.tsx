import type { Metadata } from "next";
import { LoginScreen } from "../../components/pages/login/login-screen";

export const metadata: Metadata = {
  title: "Sign in | AVC Pet Hospital",
  description: "Sign in to your AVC account.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ reason?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { reason } = await searchParams;
  return <LoginScreen reason={typeof reason === "string" ? reason : undefined} />;
}
