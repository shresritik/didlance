"use client";
import React, { useEffect, useState } from "react";
import {
  useWallet,
  ConnectButton,
  addressEllipsis,
  BaseError,
  ErrorCode,
} from "@suiet/wallet-kit";
import Link from "next/link";
import { ChevronDown, Bell, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRandomDigitalArt, queryClient } from "@/lib/utils";
import NotificationDialog from "../Noti";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import RandomAvatar from "../utils/RandomAvatar";

const Navbar = () => {
  const pathname = usePathname();
  const wallet = useWallet();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClientMode, setIsClientMode] = useState(false);

  const postUser = async (account: string) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sui_address: account,
        commit: 1000.0,
      }),
    });
    const jsonResponse = await res.json();
    return jsonResponse;
  };

  const { data: user, mutateAsync } = useMutation({
    mutationKey: ["user"],
    mutationFn: postUser,
  });
  // Modified useEffect for address tracking
  // useEffect(() => {
  //   if (wallet.address) {
  //     setAddress(wallet.address);
  //   } else {
  //     setAddress("");
  //   }
  // }, [wallet.address]); // Only depend on wallet.address

  const handleClick = (action: string) => {
    switch (action) {
      case "profile":
        // Navigate to profile or perform profile-related action
        console.log("profile clicked");
        break;
      case "settings":
        // Navigate to settings or perform settings-related action
        console.log("settings clicked");
        break;
      case "client-mode":
        // Navigate to settings or perform settings-related action

        break;

      default:
        console.warn("Unknown action:", action);
    }
  };
  const handleToggle = (checked: boolean) => {
    setIsClientMode(checked);
    if (checked) {
      router.push("/post-work");
    } else {
      router.push("/job-feed");
    }
  };
  useEffect(() => {
    setIsClientMode(pathname === "/post-work");
  }, [pathname]);

  return (
    <nav className="border-b border-gray-200 bg-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 justify-center items-center text-lg"
            >
              <span>Stake</span>
              <span className=" font-bold text-blue-400">Lance</span>
            </Link>
            {pathname !== "/" && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  href="/feed"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Feed
                </Link>

                {!isClientMode ? (
                  <>
                    <Link
                      href="/job-feed"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Find Work
                    </Link>

                    {wallet.address && (
                      <Link
                        href="/dashboard/my-jobs"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    {" "}
                    <Link
                      href="/post-work"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Post Work
                    </Link>
                    <Link
                      href="/dashboard/my-jobs"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Jobs
                    </Link>
                  </>
                )}
                <Link
                  href="/membership"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Membership
                </Link>
              </div>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {pathname !== "/" ? (
              <>
                <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-lg">
                  {/* <div>{user?.message?.commit} Commits</div> */}
                  <h4
                    className="font-medium"
                    onClick={() => handleClick("client-mode")}
                  >
                    {" "}
                    Client Mode
                  </h4>
                  <Switch
                    checked={isClientMode}
                    onCheckedChange={(checked: boolean) =>
                      handleToggle(checked)
                    }
                  />
                </div>
                <div className="relative">
                  {wallet.connected && wallet.account ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center space-x-3">
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium">
                            {addressEllipsis(wallet.account.address)}
                          </p>
                        </div>
                        <RandomAvatar />
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleClick("profile")}
                          className="cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                        >
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleClick("settings")}
                          className="cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                        >
                          Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            wallet.disconnect();
                            queryClient.resetQueries({
                              queryKey: ["user"],
                              exact: true,
                            });
                            router.push("/");
                          }}
                          className="cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                        >
                          Disconnect Wallet
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <ConnectButton
                      onConnectSuccess={async (walletName: string) => {
                        await mutateAsync(wallet.address);
                        console.log(user);
                        console.log(walletName, wallet.getAccounts());
                      }}
                      onConnectError={(err: BaseError) => {
                        if (
                          err.code ===
                          ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED
                        ) {
                          console.log(
                            "user rejected the connection to " +
                              err.details?.wallet
                          );
                        } else {
                          console.log("unknown connect error: ", err);
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                    />
                  )}
                </div>
              </>
            ) : (
              <Link
                href={"/feed"}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-3 rounded-lg  font-semibold inline-flex items-center gap-3 shadow-lg"
              >
                Go to App
              </Link>
            )}
            {/* <NotificationDialog suiAddress={address} /> */}

            {/* <div className="cursor-pointer hover:bg-gray-200 transition-colors duration-200 flex justify-between items-center ">
              <span onClick={() => handleClick("client-mode")}>
               
              </span>
              <Switch
                checked={isClientMode}
                onCheckedChange={(checked: boolean) => handleToggle(checked)}
                className="ml-2 h-6 w-12 bg-gray-300 border-2 border-gray-400 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              />
            </div> */}

            {/* Mobile menu dialog */}
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DialogTrigger asChild>
                <button className="md:hidden text-gray-600 hover:text-gray-900">
                  <Menu className="h-6 w-6" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Menu</DialogTitle>
                  <DialogDescription>Navigation options</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 p-4">
                  <Link
                    href="/feed"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Feed
                  </Link>
                  {!isClientMode ? (
                    <>
                      <Link
                        href="/job-feed"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Find Work
                      </Link>
                      <Link
                        href="/dashboard//my-jobs"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Jobs
                      </Link>
                      <Link
                        href="/my-proposals"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Proposals
                      </Link>
                      <Link
                        href="/messages"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Messages
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/job-feed"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Post Work
                      </Link>
                      <Link
                        href="/dashboard//my-jobs"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Jobs
                      </Link>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
