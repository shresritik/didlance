import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function Sidebar() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <h2 className="text-lg font-semibold">Add to your feed</h2>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="AI Recruiter" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">AI Recruiter</div>
              <div className="text-sm text-muted-foreground">
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
              <div className="text-sm text-muted-foreground">
                Company • Technology
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}
