"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileImage, Newspaper, Briefcase, Sparkles } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import Upload from "../utils/Upload";
import { useWallet } from "@suiet/wallet-kit";
import { useMutation } from "@tanstack/react-query";
import { getRandomDigitalArt, queryClient } from "@/lib/utils";
import RandomAvatar from "../utils/RandomAvatar";
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

export function CreatePost() {
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
    console.log(data);
    mutate(data, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post"] }),
    });
  };
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex gap-1">
          <RandomAvatar />
          <form onSubmit={handleSubmit} className=" space-x-2 flex w-full">
            <div className="w-full">
              <Input
                className="w-full mb-4"
                placeholder="Share your posts"
                type="text"
                onChange={(e) => setPost(e.target.value)}
              />
              {uploadStates.err && (
                <p className="text-red-500 py-2">{uploadStates.err}</p>
              )}
              <div className="flex  space-x-2">
                <Upload
                  onError={onError}
                  onSuccess={onSuccess}
                  onUploadStart={onUploadStart}
                />
              </div>
            </div>
            <Button disabled={uploadStates.isLoading}>Post</Button>
          </form>
        </div>
        {/* <div className="flex gap-2 mt-4">
          <Button variant="ghost" className="flex-1">
            <FileImage className="w-5 h-5 mr-2" />
            Media
          </Button>
          <Button variant="ghost" className="flex-1">
            <Briefcase className="w-5 h-5 mr-2" />
            Job
          </Button>
          <Button variant="ghost" className="flex-1">
            <Newspaper className="w-5 h-5 mr-2" />
            Write article
          </Button>
        </div> */}
      </div>
    </div>
  );
}
