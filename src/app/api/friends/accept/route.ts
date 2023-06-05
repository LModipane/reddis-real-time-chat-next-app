export async function POST(req: Request) {
	console.log('hello from server');
	console.log("request body: ",req.body);
	return new Response('Hello worlds', { status: 200 });
}
