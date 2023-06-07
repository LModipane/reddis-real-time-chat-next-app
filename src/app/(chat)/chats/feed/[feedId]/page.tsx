import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { fetchRedis } from '@/lib/helper/redis';

type Props = {
	params: {
		feedId: string;
	};
};

export default async function FeedPage({ params }: Props) {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	const { user: currentUser } = session;
	const { feedId } = params;

	const [userId1, userId2] = feedId.split('--');
	// if (currentUser.id !== userId1 || currentUser.id !== userId2) notFound();

	const chatPartnerId = currentUser.id === userId1 ? userId2 : userId1;
	const chatPartner = (await fetchRedis(
		'get',
		`user:${chatPartnerId}`,
	)) as string;
	const parsedChatPartner = JSON.parse(chatPartner) as User;

	return (
		<div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
			<div className="flex sm:items-center justify-between py-3 px-2 border-b-2 border-gray-200">
				<div className="relative flex items-center space-x-4">
					<div className="relative">
						<div className="relative w-8 sm:w-12 h-8 sm:h-12">
							<Image
								fill
								referrerPolicy="no-referrer"
								src={parsedChatPartner.image}
								alt={`${parsedChatPartner.name} profile picture`}
								className="rounded-full"
							/>
						</div>
					</div>

					<div className="flex flex-col leading-tight">
						<div className="text-xl flex items-center">
							<span className="text-gray-700 mr-3 font-semibold">
								{parsedChatPartner.name}
							</span>
						</div>

						<span className="text-sm text-gray-600">
							{parsedChatPartner.email}
						</span>
					</div>
				</div>
			</div>

			<Messages/>
		</div>
	);
}
