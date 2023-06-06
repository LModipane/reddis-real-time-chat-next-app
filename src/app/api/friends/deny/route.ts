import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { fetchRedis } from '@/lib/helper/redis';
import { senderIdValidator } from '@/lib/validators/add-friend';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) return new Response('Opps Unauthorized', { status: 401 });

	try {
		const body = await req.json();
		const { senderId: idToDeny } = senderIdValidator.parse(body);

		await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

		return new Response('Friend request declined', { status: 200 });
	} catch (error) {
		if (error instanceof ZodError)
			return new Response('invalid request', { status: 422 });

		console.log(error);
		return new Response('Opps something went wrong', { status: 500 });
	}
}
