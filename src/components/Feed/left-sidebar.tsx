"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HelpCircle, Sparkles } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useWallet } from "@suiet/wallet-kit";
import { getRandomDigitalArt, truncateHex } from "@/lib/utils";
import RandomAvatar from "../utils/RandomAvatar";

export function LeftSidebar() {
  const wallet = useWallet();

  return (
    <ScrollArea.Root className="h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <ScrollArea.Viewport className="h-full w-full">
        <div className="space-y-4 ">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="">StakeLance</span>
                </div>
                <HelpCircle className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex items-center text-sm mb-2">
                <RandomAvatar />
                <span>{truncateHex(wallet?.address)}</span>
              </div>
              <div className="text-sm mb-2">
                Current Plan:{" "}
                <span className="font-semibold text-green-600">
                  Forever Free
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  Today touchpoints{" "}
                  <span className="float-right font-semibold">0</span>
                </div>
                <div>
                  Monitored prospects{" "}
                  <span className="float-right font-semibold">0</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Open dashboard
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="relative h-16 bg-gradient-to-r from-blue-400 to-blue-600">
              <Avatar className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-16 h-16 border-4 border-white">
                <AvatarImage src="/placeholder-user.jpg" alt="Prashant Soni" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
            </div>
            <div className="pt-10 p-4 text-center">
              <h3 className="font-semibold text-lg">Prashant Soni</h3>
              <p className="text-sm text-gray-500">
                Web3 & Crypto | Startups | Freelance
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Profile viewers</span>
                  <span className="font-semibold text-blue-600">304</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Post impressions</span>
                  <span className="font-semibold text-blue-600">2,274</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <h4 className="font-semibold mb-2">
                Discover your next customer
              </h4>
              <Button variant="outline" className="w-full">
                Try Sales Nav for $0
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:bg-gray-300 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
