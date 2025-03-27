import RegisterForm from "@/components/auth/register";
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
      <RegisterForm />
      <Link href="/login" className="text-slate-700">
        Already have an account?
      </Link>
    </div>
  );
};

export default Page;
