"use client";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "@/components/likes";

interface TweetsProps {
  tweets: TweetWithAuthor[];
}

export default function Tweets({ tweets }: TweetsProps) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, handleOptimisticTweets);

  function handleOptimisticTweets(
    currentOptimisticTweets: TweetWithAuthor[],
    newTweet: TweetWithAuthor
  ) {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  }

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return (
    <div className="max-w-lg m-auto flex flex-col gap-4">
      {optimisticTweets.map((tweet) => {
        return (
          <div
            key={tweet.created_at}
            className="bg-white border shadow p-4 rounded-xl flex gap-4"
          >
            <div className="h-12 w-12">
              <Image
                className="rounded-full"
                src={tweet.author.avatar_url}
                alt="tweet user avatar"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col gap-1 justify-start items-start">
              <p>
                <strong>{tweet.author.name}</strong>{" "}
                <span className="text-slate-500">
                  @{tweet.author?.username}
                </span>
              </p>
              <p>{tweet.title}</p>
              <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
