import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { fetchRedis } from '@/lib/helper/redis';
import { senderIdValidator } from '@/lib/validators/add-friend';
import { getServerSession } from 'next-auth';
import { ZodError, z } from 'zod';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) return new Response('Opps, Unauthorized', { status: 401 });

	try {
		const body = await req.json();
		const { senderId: idToAdd } = senderIdValidator.parse(body);

		const isAlreadyFriend = await fetchRedis(
			'sismember',
			`user:${session.user.id}:friends`,
			idToAdd,
		);
		if (isAlreadyFriend)
			return new Response('Already a friend', { status: 400 });

		const hasSenderRequested = await fetchRedis(
			'sismember',
			`user:${session.user.id}:incoming_friend_requests`,
			idToAdd,
		);
		if (!hasSenderRequested)
			return new Response('invalid friend request', { status: 400 });

		db.sadd(`user:${session.user.id}:friends`, idToAdd);
		db.sadd(`user:${idToAdd}:friends`, session.user.id);
		db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

		return new Response('', { status: 200 });
	} catch (error) {
		if (error instanceof ZodError)
			return new Response('inValid request: ', { status: 422 });
		console.log(error);
	}
}
