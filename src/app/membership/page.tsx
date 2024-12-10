import { MembershipCard } from "@/components/Membership/membership-card";
import { memberships } from "@/components/Membership/utils";

export default function MembershipPage() {
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
                <MembershipCard {...membership} />
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
    </div>
  );
}
