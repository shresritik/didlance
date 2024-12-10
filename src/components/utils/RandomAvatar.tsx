"use client";
import { getRandomDigitalArt } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const RandomAvatar = () => {
  return (
    <Avatar className="w-7 h-7 mr-2">
      <AvatarImage
        className=" rounded-full"
        src={getRandomDigitalArt()}
        alt="User"
      />
    </Avatar>
  );
};

export default React.memo(RandomAvatar);
