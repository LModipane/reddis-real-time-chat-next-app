const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = 'zrange' | 'sismember' | 'get' | 'smembers';

export async function fetchRedis(
	command: Command,
	...args: (string | number)[]
) {
	const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`;

	const RESTResponse = await fetch(commandUrl, {
		headers: {
			Authorization: `Bearer ${upstashRedisRestToken}`,
		},
		cache: 'no-store',
	});

	if (!RESTResponse.ok) {
		console.log(RESTResponse.statusText);
		throw new Error(`Error in fetching Redis data`);
	}

	const data = await RESTResponse.json();

	return data.result;
}
