"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function GithubButton() {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  return (
    <button
      className="bg-black flex text-white justify-center items-center gap-4 p-4 rounded-lg hover:bg-gray-700 transition-colors"
      onClick={handleSignIn}
    >
      <GitHubLogoIcon className="w-6 text-white h-auto" />
      <span className="whitespace-nowrap">Log In with GitHub</span>
    </button>
  );
}
