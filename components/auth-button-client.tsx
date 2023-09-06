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
      className="bg-blue-600 p-2 text-white/90 rounded-lg"
      onClick={handleSignOut}
    >
      Log Out
    </button>
  ) : (
    <button
      className="bg-blue-600 p-2 text-white/90 rounded-lg"
      onClick={handleSignIn}
    >
      Log In
    </button>
  );
}
