"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface ConfirmationDialogProps {
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  plan: string;
  price: number;
}

export function ConfirmationDialog({
  loading,
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  plan,
  price,
}: ConfirmationDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-4">
            {description}
          </Dialog.Description>
          <div className="mb-4">
            <p className="font-semibold">Selected Plan: {plan}</p>
            <p className="font-semibold">Price: ${price}/month</p>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={onConfirm}
              className={`px-4 py-2 ${
                loading ? "bg-gray-300" : "bg-yellow-400  hover:bg-yellow-500"
              } text-gray-900 rounded `}
            >
              Confirm
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full p-2 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
