"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const layout = ({ children }) => {
  const pathname = usePathname();
  return (
    <div className="flex w-full ">
      <div className="flex flex-col flex-[0.2]  p-5 border-r border-gray-200">
        <Link
          href={"/dashboard/my-jobs"}
          className={`p-2 ${
            pathname.startsWith("/dashboard/my-jobs")
              ? "bg-gray-200 "
              : "bg-white"
          }`}
        >
          {" "}
          My Jobs
        </Link>
        <Link
          href={"/dashboard/my-proposals"}
          className={`p-2 ${
            pathname.startsWith("/dashboard/my-proposals")
              ? "bg-gray-200 "
              : "bg-white"
          }`}
        >
          My Proposals
        </Link>
        <div className=" border-t border-gray-200 mt-2 pt-2">
          <Link
            href={"/dashboard/wallet"}
            className={`block p-2 ${
              pathname.startsWith("/dashboard/wallet")
                ? "bg-gray-200 "
                : "bg-white"
            }`}
          >
            Wallet
          </Link>
        </div>
      </div>
      <div className="flex-[1]">{children}</div>
    </div>
  );
};

export default layout;
