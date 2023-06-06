import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { fetchRedis } from '@/lib/helper/redis';
import { addFriendValidator } from '@/lib/validators/add-friend';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new Response('Opps, Unautherized request', { status: 401 });
	}

	try {
		const body = await req.json();

		const { email: validatedEmailToAdd } = addFriendValidator.parse(body);

		const friendId = (await fetchRedis(
			'get',
			`user:email:${validatedEmailToAdd}`,
		)) as string;

		if (!friendId) return new Response('Friend not found!', { status: 404 });

		if (friendId === session.user.id) {
			return new Response("You can't add yourself as a friend!", {
				status: 400,
			});
		}

		//check if friend request is already sent
		const hasAlreadyRequested = (await fetchRedis(
			'sismember',
			`user:${friendId}:incoming_friend_requests`,
			session.user.id,
		)) as 0 | 1;
		if (hasAlreadyRequested)
			return new Response('You have already requested this friend!', {
				status: 400,
			});
		
		//check if you are already friends 
		const areAlreadyFriends = (await fetchRedis(
			'sismember',
			`user:${session.user.id}:friends`,
			friendId,
		)) as 0 | 1;
		if (areAlreadyFriends)
			return new Response("You're already friends!", { status: 400 });

		//send friend request
		db.sadd(`user:${friendId}:incoming_friend_requests`, session.user.id); //this line will post the current user's id to the friends incoming friend request list.

		return new Response('OK', { status: 200 });
	} catch (error) {
		if (error instanceof ZodError)
			return new Response('Invalid request payload', { status: 422 });

		return new Response('Invalid request', { status: 400 });
	}
}
