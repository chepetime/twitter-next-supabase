import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import LoginButton from "@/components/auth-button-server";
import NewTweet from "@/components/new-tweet";
import Tweets from "@/components/tweets";

export const dynamic = "force-dynamic";
export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)")
    .order("created_at", { ascending: false });

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <main className="w-full">
      <div className="bg-white px-4 py-2 shadow-lg flex justify-between items-center fixed right-0 left-0 top-0">
        <p className="text-lg text-blue-900 font-extrabold">Home</p>
        <LoginButton />
      </div>

      <div className="max-w-4xl mx-auto pt-32 pb-32">
        <NewTweet user={session.user} />
        <Tweets tweets={tweets} />
      </div>
    </main>
  );
}
