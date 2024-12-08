"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getRandomDigitalArt, truncateHex } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import { formatTimeDifference } from "../utils/utils";
type Post = {
  id?: string;
  sui_address: string;
  post: string;
  url: string;
  createdAt: string;
};
export function Feed() {
  const fetchPosts = async () => {
    const data = await fetch("/api/posts");
    const res = await data.json();
    return res;
  };

  const { data: allPosts, isLoading } = useQuery({
    queryKey: ["post"],
    queryFn: fetchPosts,
  });
  return (
    <>
      {isLoading && <h2>Loading...</h2>}
      {allPosts?.message.map((post: Post) => (
        <div className="bg-white rounded-lg shadow" key={post.id}>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={getRandomDigitalArt()} alt="User" />
                  <AvatarFallback>HA</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {truncateHex(post.sui_address)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeDifference(post.createdAt)}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="p-4 pt-0 space-y-4">
            <p>{post.post}</p>
            <Image
              src={post.url}
              alt="LinkedIn Branding"
              width={600}
              height={400}
              className="rounded-lg w-full"
            />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comment
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
