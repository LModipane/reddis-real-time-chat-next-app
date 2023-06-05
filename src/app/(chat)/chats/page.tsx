import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

export default async function chatsPage() {
	const session = await getServerSession(authOptions);
	return <div>chatsPage</div>;
}
