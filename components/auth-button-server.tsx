import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import LoginButtonClient from "@/components/auth-button-client";

export const dynamic = "force-dynamic";

export default async function AuthButtonServer() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.auth.getSession();
  return <LoginButtonClient session={data.session} />;
}
