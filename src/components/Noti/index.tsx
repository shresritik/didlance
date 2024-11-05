import { Badge } from "@/components/ui/badge"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Bell } from 'lucide-react';

const NotificationDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="text-gray-600 hover:text-gray-900 relative">
					<Bell className="h-5 w-5" />
					<Badge
						className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white border-2 border-white rounded-full"
					>
						2
					</Badge>
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Notifications</DialogTitle>
					<DialogDescription>
						Your recent notifications will appear here.
					</DialogDescription>
				</DialogHeader>
				<div className="p-4">
					<p className="text-sm text-gray-500">No new notifications</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default NotificationDialog;
