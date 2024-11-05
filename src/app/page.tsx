"use client"
import React, { useEffect } from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import "@suiet/wallet-kit/style.css";
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Nav';

export default function App() {
  // Get access to the connected wallet
  const wallet = useWallet();
  const router = useRouter()

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
        </div>
      </main>
    </>
  );
}

