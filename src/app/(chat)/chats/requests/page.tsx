import FriendRequests from '@/components/FriendRequests';
import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/lib/helper/redis';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

async function FriendRequestPage() {
	const session = await getServerSession(authOptions);

	if (!session) notFound();

	const incomingFriendRequestIds = (await fetchRedis(
		'smembers',
		`user:${session.user.id}:incoming_friend_requests`,
	)) as string[];

	const incomingFriendRequest = await Promise.all(
		incomingFriendRequestIds.map(async senderId => {
			const res = await fetchRedis('get', `user:${senderId}`);
			const sender = JSON.parse(res);

			return {
				senderId,
				senderEmail: sender.email,
			};
		}),
	); //this function will run all asyn function at the same time for element in the array and return an array of objects

	return (
		<main className="pt-8 pl-3">
			<h1 className="font-bold text-5xl mb-8">Add a friend</h1>
			<div className="flex flex-col gap-4">
				<FriendRequests initialFriendRequests={incomingFriendRequest} />
			</div>
		</main>
	);
}

export default FriendRequestPage;
