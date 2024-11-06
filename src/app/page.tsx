"use client"
import React, { useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import "@suiet/wallet-kit/style.css";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function App() {
  // Get access to the connected wallet
  const wallet = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    console.log('connected wallet name: ', wallet.name);
    console.log('account address: ', wallet.account?.address);
    console.log('account publicKey: ', wallet.account?.publicKey);
  }, []);

  return (
    <>
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Your main content goes here */}
          <Button
            onClick={() => {
              toast({
                variant: "destructive",
                className: "text-black-400 text-3xl fixed top-10",
                title: "Scheduled: Catch up",
                description: "Friday, February 10, 2023 at 5:57 PM",
              })
            }}
            hidden={true}
          >
            Show Toast
          </Button>
        </div>
      </main>
    </>
  );
}

