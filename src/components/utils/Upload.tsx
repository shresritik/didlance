"use client";
import React from "react";
import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const authenticator = async () => {
  try {
    const response = await fetch("/api/upload-auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export default function Upload({ onError, onSuccess, onUploadStart }) {
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        onUploadStart={onUploadStart}
        className="text-sm text-grey-500
        file:mr-5 file:py-2 file:px-6
        file:rounded-full file:border-0
        file:text-sm file:font-medium
        file:bg-gray-80 file:text-gray-700
        hover:file:cursor-pointer hover:file:bg-gray-200
        hover:file:text-gray-700"
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
      />
    </ImageKitProvider>
  );
}
