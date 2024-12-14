"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Upload from "@/components/utils/Upload";
import { queryClient, truncateHex } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";

interface uploadStates {
  url: string;
  err?: string;
  isLoading: boolean;
}

type Post = {
  id?: string;
  sui_address: string;
  post: string;
  url: string;
};
const App = () => {
  const wallet = useWallet();
  const [uploadStates, setUploadStates] = useState<uploadStates>({
    url: "",
    err: "",
    isLoading: false,
  });
  const [post, setPost] = useState("");
  const onError = ({ message }: { message: string }) => {
    console.log("Error", message);
    setUploadStates({ url: "", isLoading: false, err: message });
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setUploadStates({ url: res.url, isLoading: false });
  };
  const onUploadStart = (progress) => {
    console.log("progress", progress);
    setUploadStates({ url: "", isLoading: true });
  };
  const createPost = async (body: Post) => {
    const data = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const res = await data.json();
    return res;
  };

  const fetchPosts = async () => {
    const data = await fetch("/api/posts");
    const res = await data.json();
    return res;
  };

  const { data: allPosts, isLoading } = useQuery({
    queryKey: ["post"],
    queryFn: fetchPosts,
  });
  const { mutate } = useMutation({
    mutationKey: ["post"],
    mutationFn: createPost,
    onSuccess: () => {},
    onError: () => {},
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wallet.address) return;
    const data: Post = {
      post,
      sui_address: wallet.address,
      url: uploadStates.url,
    };
    mutate(data, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post"] }),
    });
  };
  return (
    <div className="flex flex-col  items-center mt-20 w-1/2 mx-auto">
      {wallet.address && (
        <Card className="w-full">
          <CardContent className="p-2 space-y-5">
            <form onSubmit={handleSubmit}>
              <h4>Write your posts</h4>
              <Input type="text" onChange={(e) => setPost(e.target.value)} />
              {uploadStates.err && (
                <p className="text-red-500 py-2">{uploadStates.err}</p>
              )}
              <div className="flex justify-center space-x-2">
                <Upload
                  onError={onError}
                  onSuccess={onSuccess}
                  onUploadStart={onUploadStart}
                />
                <Button disabled={uploadStates.isLoading}>Post</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <h3 className="w-full my-5">Posts</h3>

      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        allPosts.message.map((post: Post) => (
          <Card
            key={post.id}
            className="py-5 w-full flex flex-col justify-center items-center mb-5"
          >
            <CardContent>
              <Image
                src={post.url}
                alt=""
                width={500}
                height={500}
                style={{ maxWidth: "100%" }}
              />
              <p>{post.post}</p>
              <p>Posted by:{truncateHex(post.sui_address)}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default App;
