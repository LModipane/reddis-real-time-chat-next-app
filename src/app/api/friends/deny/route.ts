export async function DELETE(req: Request) {
	console.log('hello from server');
	console.log(req);
	return new Response('Hello World!', { status: 200 });
}
