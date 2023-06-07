import { feedHrefConstructor } from '@/lib/utils';
import { type Session } from 'next-auth';
import React from 'react';

type Props = {
	friends: User[];
	currentUserId: string;
};

export default function SideBarChats({ friends, currentUserId }: Props) {
	return (
		<ul className="max-h-[25rem] overflow-y-auto space-y-1 ">
			{friends.map(friend => {
				return (
					<li key={friend.id}>
						<a
							className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full capitalize"
							href={`/chats/feed/${feedHrefConstructor(
								currentUserId,
								friend.id,
							)}`}>
							{friend.name}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
