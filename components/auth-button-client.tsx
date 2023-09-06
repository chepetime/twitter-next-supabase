"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  session: Session | null;
}

export default function AuthButton({ session }: AuthButtonProps) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <button
      className="bg-blue-700 font-bold text-white p-2 rounded-xl"
      onClick={handleSignOut}
    >
      Logout
    </button>
  ) : (
    <button
      className="bg-blue-700 font-bold text-white p-2 rounded-xl"
      onClick={handleSignIn}
    >
      Login
    </button>
  );
}
