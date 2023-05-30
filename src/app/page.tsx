import { db } from '@/lib/db';

export default async function Home() {
	await db.set('message', 'hello world');
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			hello world
		</main>
	);
}
