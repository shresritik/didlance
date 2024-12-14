"use client";
import { ConfirmationDialog } from "@/components/Membership/confirmation-dialog";
import { MembershipCard } from "@/components/Membership/membership-card";
import { memberships, membershipStatus } from "@/components/Membership/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
interface Membership {
  title: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function MembershipPage() {
  const wallet = useWallet();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Membership | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSelectPlan = (plan: Membership) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const postMembership = async (body: {
    sui_address: string;
    membership: string;
  }) => {
    const data = await fetch("/api/membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const res = await data.json();
    return res;
  };

  const { data, mutate, isPending } = useMutation({
    mutationFn: postMembership,
    onSuccess: () => {},
  });
  const handleConfirmPlan = async () => {
    if (!wallet.address) return;
    const body = {
      sui_address: wallet.address,
      membership: membershipStatus[selectedPlan?.title],
    };
    // Here you would typically handle the subscription process
    mutate(body, {
      onSuccess: (data) => {
        if (data?.status === 200) {
          queryClient.invalidateQueries({
            queryKey: ["user/" + wallet.address],
          });
          toast({
            variant: "destructive",
            title: "Membership is purchased successfully",
            description: "Successful.",
            className: "bg-green-500 text-white",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed to purchase membership.",
            description: data.message,
            className: "bg-red-500 text-white",
          });
        }
        setIsDialogOpen(false);
      },
      onError: (data) =>
        toast({
          variant: "destructive",
          title: "Failed to purchase membership.",
          description: data.message,
          className: "bg-red-500 text-white",
        }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Membership
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Unlock your freelancing potential with our tiered membership plans.
            Upgrade anytime to access more features and opportunities.
          </p>
        </div>
        <div className="mt-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-72 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          </div>
          <div className="relative flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-4">
            {memberships.map((membership, index) => (
              <div
                key={membership.title}
                className={`transform 
            ${index === 0 ? "sm:translate-y-12" : ""} ${
                  index === 1 ? "sm:translate-y-8" : ""
                } ${index === 2 ? "sm:translate-y-12" : ""}`}
              >
                <MembershipCard
                  {...membership}
                  onSelect={() => handleSelectPlan(membership)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Gamify Your Experience
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Level up your membership by completing challenges, referring
            friends, and maintaining a stellar profile. Earn bonus features and
            discounts!
          </p>
        </div>
      </div>
      <ConfirmationDialog
        loading={isPending}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmPlan}
        title="Confirm Your Subscription"
        description="Are you sure you want to subscribe to this plan?"
        plan={selectedPlan?.title || ""}
        price={selectedPlan?.price || 0}
      />
    </div>
  );
}
