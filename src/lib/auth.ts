import { NextAuthOptions } from 'next-auth';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { db } from './db';
import GoogleProvider from 'next-auth/providers/google';

function getGoogleCred() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

	if (!clientId || clientId.length === 0)
		throw new Error('Missing Google Client ID');
	if (!clientSecret || clientSecret.length === 0)
		throw new Error('Missing Google Client Secret');
	return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
	adapter: UpstashRedisAdapter(db), //this is a function that will run once user logins in and will return a user object
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
	providers: [
		GoogleProvider({
			clientId: getGoogleCred().clientId,
			clientSecret: getGoogleCred().clientSecret,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			const dbUser = (await db.get(`user:${token}`)) as User | null;
			if (!dbUser) {
				token.id = user!.id;
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				image: dbUser.image,
			};
		}, //this function is responsible for return the token that we will use for authentication
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}
			return session;
		},
		redirect() {
			return '/chats';
		},
	}, //this function will run once google/provider as authorised the user
};
