import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

import LoginButton from "@/components/auth-button-server";
import GithubButton from "@/components/github-button";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen w-full p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl flex justify-center items-center gap-8 flex-col">
        <h1 className="text-center text-4xl">Blue bird</h1>

        <GithubButton />
      </div>
    </main>
  );
}
