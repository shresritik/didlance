import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export function RightSidebar() {
  return (
    <ScrollArea.Root className="h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <ScrollArea.Viewport className="h-full w-full">
        <div className="space-y-4 pl-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Add to your feed</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="AI Recruiter" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">AI Recruiter</div>
                    <div className="text-sm text-gray-500">
                      Company • Staffing and Recruiting
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="a16z crypto" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">a16z crypto</div>
                    <div className="text-sm text-gray-500">
                      Company • Technology
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Get the latest jobs and industry news
                </p>
                <Avatar className="mx-auto my-4 h-16 w-16">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <Button className="w-full" variant="outline">
                  Try for Free
                </Button>
              </div>
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
