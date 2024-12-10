"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, getRandomDigitalArt, truncateHex } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import { formatTimeDifference } from "../utils/utils";
import RandomAvatar from "../utils/RandomAvatar";
import { useState } from "react";
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

  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [id: string]: string[] }>({});
  const [singleComment, setSingleComment] = useState<{
    [id: string]: string[];
  }>({});

  // State to track visibility of comment dropdowns
  const [commentDropdowns, setCommentDropdowns] = useState<{
    [id: string]: boolean;
  }>({});

  const toggleLike = (postId: string) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: !prevLikes[postId],
    }));
  };

  const addComment = (postId: string) => {
    const lastComment =
      singleComment[postId]?.[singleComment[postId].length - 1];
    if (!lastComment) return; // Avoid adding empty comments

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), lastComment],
    }));

    // Clear the comment box after posting
    setSingleComment((prev) => ({
      ...prev,
      [postId]: [], // Reset the comment array for the post
    }));
  };

  const toggleCommentDropdown = (postId: string) => {
    setCommentDropdowns((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const selectCommentBox = (postId: string, comment: string) => {
    setSingleComment((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment],
    }));
  };
  return (
    <>
      {isLoading && <h2>Loading...</h2>}
      {allPosts?.message.map((post: Post) => (
        <div className="bg-white rounded-lg shadow" key={post.id}>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-1 w-full">
                <RandomAvatar />
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
            {post.url && (
              <Image
                src={post.url}
                alt="LinkedIn Branding"
                width={600}
                height={400}
                className="rounded-lg w-full"
              />
            )}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(post.id!)}
              >
                <ThumbsUp
                  className={cn("w-4 h-4 mr-2", {
                    "fill-blue-400": likes[post.id!],
                  })}
                />
                Like
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCommentDropdown(post.id!)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Comment
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            {commentDropdowns[post.id!] && (
              <div className="relative mt-2">
                <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 w-full">
                  <textarea
                    onChange={(e) => selectCommentBox(post.id, e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        addComment(post.id!);
                      }}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* Display Comments */}
            {comments[post.id!] && (
              <div className="pt-4 space-y-2">
                {comments[post.id!].map((comment, index) => (
                  <div
                    key={index}
                    className="text-sm bg-gray-100 p-2 rounded-lg"
                  >
                    {comment}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
