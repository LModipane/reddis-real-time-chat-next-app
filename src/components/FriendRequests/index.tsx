'use client';
import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

type Props = {
	initialFriendRequests: incomingFriendRequest[];
};

function FriendRequests({ initialFriendRequests }: Props) {
	const router = useRouter();
	const [friendRequests, setFriendRequests] = useState(initialFriendRequests);

	const denyFriendRequest = async (senderId: string) => {
		try {
			await axios.delete('/api/friends/deny', { data: { senderId } });

			setFriendRequests(prev =>
				prev.filter(request => request.senderId !== senderId),
			);
		} catch (error) {
			toast.error('Opps failed to deny friend request');
		} finally {
			router.refresh();
		}
	};

  const acceptFriendRequest = async (senderId: string) => {
		try {
			await axios.post('/api/friends/accept', { senderId });
			setFriendRequests(prev =>
				prev.filter(request => request.senderId !== senderId),
			);
		} catch (error) {
			toast.error('Opps failed to accept friend request');
		} finally {
			router.refresh();
		}
	};

	return (
		<>
			{friendRequests.length <= 0 ? (
				<p className="text-sm text-zinc-600">Sorry nothing to see here</p>
			) : (
				friendRequests.map(request => (
					<div key={request.senderId} className="flex gap-4 items-center">
						<UserPlus className="text-black" />
						<p className="font-medium text-lg">{request.senderEmail}</p>
						<button
							onClick={() => acceptFriendRequest(request.senderId)}
							aria-label="accept friend"
							className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md">
							<Check className="font-semibold text-white w-3/4 h-3/4" />
						</button>

						<button
							onClick={() => denyFriendRequest(request.senderId)}
							aria-label="deny friend"
							className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md">
							<X className="font-semibold text-white w-3/4 h-3/4" />
						</button>
					</div>
				))
			)}
		</>
	);
}

export default FriendRequests;
