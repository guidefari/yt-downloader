import type { NextApiRequest, NextApiResponse } from "next";
import { type NextRequest, NextResponse } from "next/server";
// import { pipeline } from "node:stream";
// import { promisify } from "node:util";

// const pipelineAsync = promisify(pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
	const {url, title, contentType} = await req.json()
	console.log('url, title, contentType:', url, title, contentType)

	if (!url || typeof url !== "string") {
		// res.json({ error: "Invalid URL" });
		return;
	}

	try {
		const fileBlob = await fetch(url, {
			headers: {
				// set your secret headers here
			},
		})

		// This is the key part - set the headers to tell the browser to download the file
		const headers = new Headers();
		// remember to change the filename here
		headers.append("Content-Disposition", `attachment; filename="${title}.${contentType}"`);
		headers.append("Content-Type", contentType || "");

		return new Response(fileBlob.body, {
			headers,
		});
	} catch (err) {
		if (!(err instanceof Error)) return NextResponse.json(err)
		
		return NextResponse.json(
			{ error: "Failed to dl", details: err.message },
			{ status: 500 },
		);
	}
}