"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/dashboard") router.push("/dashboard/my-jobs");
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-lg">Redirecting to my jobs...</div>
    </div>
  );
};

export default Dashboard;
