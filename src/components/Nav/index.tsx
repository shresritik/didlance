"use client"
import React, { useEffect, useState } from 'react';
import { useWallet, ConnectButton, addressEllipsis } from '@suiet/wallet-kit';
import Link from 'next/link';
import { ChevronDown, Bell, Menu } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from '@/components/ui/switch';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRandomDigitalArt } from '@/lib/utils';
import NotificationDialog from '../Noti';
import { useRouter } from 'next/navigation';

const Navbar = () => {
	const wallet = useWallet();
	const router = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [address, setAddress] = useState<string>("");
	const [isClientMode, setIsClientMode] = useState(false);
	useEffect(() => {
		console.log(wallet);
		console.log('wallet status', wallet.status)
		console.log('connected wallet name', wallet.name)
		console.log('connected account info', wallet.account)
	}, [isClientMode, wallet, router]);


	// Modified useEffect for address tracking
	useEffect(() => {
		if (wallet.address) {
			setAddress(wallet.address);
			console.log("Address updated:", wallet.address);
		} else {
			setAddress("");
			console.log("Address not available");
		}
	}, [wallet.address]); // Only depend on wallet.address

	const handleClick = (action: string) => {
		switch (action) {
			case "profile":
				// Navigate to profile or perform profile-related action
				console.log("profile clicked")
				break;
			case "settings":
				// Navigate to settings or perform settings-related action
				console.log("settings clicked")
				break;
			case "client-mode":
				// Navigate to settings or perform settings-related action

				break;

			default:
				console.warn("Unknown action:", action);
		}
	}
	const handleToggle = (checked: boolean) => {
		setIsClientMode(checked);
		if (checked) {
			router.push("/post-work")
		} else {
			router.push("/job-feed")
		}
	};
	return (
		<nav className="border-b border-gray-200 bg-white fixed w-full top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Left section */}
					<div className="flex items-center">
						<Link href="/" className="flex-shrink-0">
							<h1 className="text-2xl font-bold text-green-600">DIDWork</h1>
						</Link>

						<div className="hidden md:flex ml-10 space-x-8">
							{!isClientMode ? <>
								<Link href="/job-feed" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									Find Work
								</Link>
								<Link href="/my-jobs" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									My Jobs
								</Link>
								<Link href="/my-proposals" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									My Proposals
								</Link>
								<Link href="/messages" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									Messages
								</Link>
							</> : <> <Link href="/post-work" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
								Post Work
							</Link>
								<Link href="/my-jobs" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									My Jobs
								</Link></>}
						</div>
					</div>

					{/* Right section */}
					<div className="flex items-center space-x-4">

						<NotificationDialog suiAddress={address} />

						<div className="relative">
							{wallet.connected && wallet.account ? (
								<DropdownMenu>
									<DropdownMenuTrigger className="flex items-center space-x-3">
										<div className="text-sm">
											<p className="text-gray-900 font-medium">
												{addressEllipsis(wallet.account.address)}
											</p>
										</div>
										<img suppressHydrationWarning={true}
											className="h-8 w-8 rounded-full"
											src={getRandomDigitalArt()}
											alt="Profile"
										/>
										<ChevronDown className="h-4 w-4 text-gray-500" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={() => handleClick("profile")} className="cursor-pointer hover:bg-gray-200 transition-colors duration-200">Profile</DropdownMenuItem >
										<DropdownMenuItem onClick={() => handleClick("settings")} className='cursor-pointer hover:bg-gray-200 transition-colors duration-200'>Settings</DropdownMenuItem>
										<DropdownMenuItem className="cursor-pointer hover:bg-gray-200 transition-colors duration-200 flex justify-between items-center " onSelect={(e) => { e.preventDefault(); e.stopPropagation(); }}>
											<span onClick={() => handleClick("client-mode")}>Client Mode</span>
											<Switch
												checked={isClientMode}
												onCheckedChange={(checked: boolean) => handleToggle(checked)}
												className="ml-2 h-6 w-12 bg-gray-300 border-2 border-gray-400 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											/>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => wallet.disconnect()} className='cursor-pointer hover:bg-gray-200 transition-colors duration-200'>
											Disconnect Wallet
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<ConnectButton className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700" />
							)}
						</div>

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
									<DialogDescription>
										Navigation options
									</DialogDescription>
								</DialogHeader>
								<div className="flex flex-col space-y-4 p-4">
									{
										!isClientMode ?
											<>
												<Link
													href="/job-feed"
													className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
													onClick={() => setMobileMenuOpen(false)}>
													Find Work
												</Link>
												<Link
													href="/my-jobs"
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
											</> : <>
												<Link
													href="/job-feed"
													className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
													onClick={() => setMobileMenuOpen(false)}>
													Post Work
												</Link>
												<Link
													href="/my-jobs"
													className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
													onClick={() => setMobileMenuOpen(false)}
												>
													My Jobs
												</Link>
											</>
									}
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
