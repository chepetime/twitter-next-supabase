import { cookies } from "next/headers";
import Image from "next/image";
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";

interface NewTweetProps {
  user: User;
}

export default function NewTweet({ user }: NewTweetProps) {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = formData.get("title");
    const supabase = createServerComponentClient<Database>({ cookies });

    await supabase
      .from("tweets")
      .insert({ title: String(title), user_id: user.id });
  };

  return (
    <div className="max-w-lg mx-auto mb-4 bg-white shadow-md rounded-xl p-4">
      <form action={addTweet}>
        <div className="flex gap-4 mb-2">
          <div>
            <Image
              className="rounded-full"
              src={user.user_metadata.avatar_url}
              width={48}
              height={48}
              alt=""
            />
          </div>
          <div className="w-full min-h-24">
            {/* <label className="mb-2 block" htmlFor="tweet">
              <span className="block mb-4">New Tweet</span>
            </label> */}
            <textarea
              name="tweet"
              id="tweet"
              className="border border-black/20 w-full h-24 resize-none p-2"
              placeholder="What's happpening now?!"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-600 p-2 text-white/90 rounded-lg"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
