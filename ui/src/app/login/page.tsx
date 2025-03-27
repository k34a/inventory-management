import LoginForm from "@/components/auth/login";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("token");
  if (accessToken) {
    redirect("/");
  }
  return (
    <div className="flex items-center flex-col gap-5">
      <LoginForm />
      <Link href="/register" className="text-slate-700">
        Don&apos;t have an account?
      </Link>
    </div>
  );
};

export default Page;
