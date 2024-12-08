"use client";
import React, { useEffect } from "react";
import { useWallet } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, Trophy, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

// Enhanced Animated Background with more bubbles and fixed positioning
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute w-full h-[200vh] bg-gradient-to-br from-blue-50 to-purple-50">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-200/20 rounded-full backdrop-blur-sm"
          style={{
            width: Math.random() * 150 + 50,
            height: Math.random() * 150 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 200}%`, // Doubled height range
          }}
          animate={{
            y: [0, Math.random() * 200 - 100], // Increased movement range
            x: [0, Math.random() * 50 - 25], // Added slight horizontal movement
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10, // Longer duration
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </div>
);

// Rest of the components remain the same, but let's add some backdrop blur to make content more readable
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="relative w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, rotateY: 5 }}
    transition={{
      duration: 0.3,
      type: "spring",
      stiffness: 300,
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-1 opacity-20" />
    <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-transform"
        >
          <Icon className="w-10 h-10 text-blue-600" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Features = () => (
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-12">
        <FeatureCard
          icon={Clock}
          title="No Time Waste"
          description="Say goodbye to lengthy hiring processes. Our platform enables instant connections with verified professionals, eliminating the traditional hassles of freelancer management."
        />
        <FeatureCard
          icon={Shield}
          title="Client Protection"
          description="Experience worry-free collaboration with our comprehensive security measures. Every professional is verified, and all deliverables are guaranteed through our secure platform."
        />
        <FeatureCard
          icon={Trophy}
          title="Beyond Portfolios"
          description="Let your skills shine through real-time performance. Our platform values actual expertise over traditional portfolios, creating opportunities for all skilled professionals. Get ready for the relm of migratable experience."
        />
      </div>
    </div>
  </div>
);

const HeroSection = () => (
  <div className="relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
          <h1 className="text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to the Future of Work
            </span>
          </h1>
          <p className="text-2xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing freelancing with instant, reliable, and
            portfolio-free opportunities in the new economy of micro gigs.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-8 rounded-xl text-xl font-semibold inline-flex items-center gap-3 shadow-lg">
              Get Started <ArrowRight className="w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </div>
);

const ConnectWallet = ({ wallet }) => (
  <div className="bg-white/50 backdrop-blur-lg py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Connect Your Wallet
            </h3>
            <p className="text-lg text-gray-600">
              Start your journey in the new economy
            </p>
          </div>
          {wallet.connected ? (
            <div className="text-right">
              <p className="text-lg text-gray-600 mb-2">Connected as:</p>
              <p className="font-mono text-lg bg-white px-4 py-2 rounded-lg shadow">
                {wallet.account?.address.slice(0, 6)}...
                {wallet.account?.address.slice(-4)}
              </p>
            </div>
          ) : (
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg">
              Connect Wallet
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  </div>
);

export default function About() {
  const wallet = useWallet();

  // useEffect(() => {
  //   if (wallet.connected) {
  //     console.log('connected wallet name: ', wallet.name);
  //     console.log('account address: ', wallet.account?.address);
  //     console.log('account publicKey: ', wallet.account?.publicKey);
  //   }
  // }, [wallet]);

  return (
    <>
      <main className="relative min-h-screen">
        <AnimatedBackground />
        <HeroSection />
        <Features />
        <ConnectWallet wallet={wallet} />
      </main>
    </>
  );
}
