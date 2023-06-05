import { authOptions } from '@/lib/auth';
import { type Session, getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { Icons, Icon } from '@/components/ui/icons';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton } from '@/components/SignOutButton';

type LayoutProps = {
	children: React.ReactNode;
};

type SidebarAction = {
	id: number;
	name: string;
	href: string;
	icon: Icon;
};
const sidebarAction: SidebarAction[] = [
	{
		id: 1,
		name: 'add friend',
		href: '/chats/addfriend',
		icon: 'UserPlus',
	},
];

async function layout({ children }: LayoutProps) {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	return (
		<div className="flex w-full h-screen">
			<SidebarActions session={session} />
			{children}
		</div>
	);
}

export default layout;

type Props = {
	session: Session;
};

function SidebarActions({ session }: Props) {
	return (
		<div className="flex h-full w-full max-w-xs grow flex-col gap-y-1.5 overflow-y-auto border-r border-gray-200 bg-white px-2">
			<Link href="/chats" className="flex h-16 shrink-0 items-center">
				<Icons.Logo />
			</Link>
			<nav className="flex flex-1 flex-col">
				<ul role="list" className="flex flex-1 flex-col gap-y-7">
					<li className="flex items-center">{/** Chat List */}</li>
					<li>
						<div className="text-sm font-semibold text-gray-400 leading-6">
							overview
						</div>

						<ul role="list" className="-mx-2 mt-2 space-y-1">
							{sidebarAction.map(action => {
								const Icon = Icons[action.icon];
								return (
									<li key={action.id}>
										<Link
											href={`${action.href}`}
											className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 text-semibold">
											<span className="text-indigo-600 group-hover:text-gray-500 border-gray-200 group-hover:border-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
												<Icon className="h-4 w-4" />
											</span>
											<span className="truncate">{action.name} </span>
										</Link>
									</li>
								);
							})}

							<li>{/** friend request list*/}</li>
						</ul>
					</li>

					<li className="mt-auto flex items-center ">
						<div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
							<div className="relative h-8 w-8 bg-gray-50">
								<Image
									src={session.user.image || '/default-profile.svg'}
									alt=""
									fill
									className="rounded-full"
									referrerPolicy="no-referrer"
								/>
							</div>
							<span className="sr-only">Your profile</span>
							<div className="flex flex-col">
								<span aria-hidden="true">{session.user.name}</span>
								<span className="text-xs text-zinc-400" aria-hidden="true">
									{session.user.email}
								</span>
							</div>
						</div>

						<SignOutButton className="w-full aspect-square" />
					</li>
				</ul>
			</nav>
		</div>
	);
}
