"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";

interface LikesProps {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}

export default function Likes({ tweet, addOptimisticTweet }: LikesProps) {
  const router = useRouter();
  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (tweet.user_has_liked_tweet) {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet: tweet.id });
      } else {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet: tweet.id });
      }
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLikes}
      className={`flex gap-1 justify-center items-center group`}
    >
      {tweet.user_has_liked_tweet ? (
        <HeartFilledIcon className="text-red-500 group-hover:text-red-500" />
      ) : (
        <HeartIcon className="group-hover:text-red-500" />
      )}
      <span
        className={
          tweet.user_has_liked_tweet
            ? "text-red-500"
            : "text-black group-hover:text-red-500"
        }
      >
        {tweet.likes}
      </span>
    </button>
  );
}
