import { LeftSidebar } from "@/components/Feed/left-sidebar";
import Navbar from "@/components/Nav";
import { CreatePost } from "@/components/Feed/create-post";
import { RightSidebar } from "@/components/Feed/right-sidebar";
import { Feed } from "@/components/Feed/feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-14">
        {" "}
        {/* Add top padding to account for fixed navbar */}
        <div className="container max-w-[1280px] mx-auto px-4">
          <div className="flex justify-center">
            <div className=" fixed left-[max(0px,calc(50%-640px+16px))]">
              <LeftSidebar />
            </div>
            <main className="w-full space-y-4 max-w-[600px] mx-[260px]">
              <CreatePost />
              <Feed />
            </main>
            <div className="w-[300px] fixed right-[max(0px,calc(50%-640px+16px))]">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
