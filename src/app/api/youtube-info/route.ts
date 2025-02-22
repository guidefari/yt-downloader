import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(req: Request) {
	const { url } = await req.json();

	if (!url) {
		return NextResponse.json({ error: "URL is required" }, { status: 400 });
	}

	const videoId = extractId(url);

	if (!videoId) {
		return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
	}

	try {
		const info = await ytdl.getInfo(url);
		const audioFormats = ytdl.filterFormats(info.formats, "audioonly");

		return NextResponse.json({
			title: info.videoDetails.title,
			embed: info.videoDetails.embed,
			formats: audioFormats
				.filter((format) => format.container === "mp4")
				.map(
					({
						audioBitrate,
						url,
						mimeType,
						contentLength,
						approxDurationMs,
						codecs,
						container,
					}) => ({
						audioBitrate,
						codecs,
						mimeType: container,
						url,
						contentLength,
						approxDurationMs,
					}),
				),
		});
	} catch (err) {
		if (!(err instanceof Error)) {
			return NextResponse.error();
		}
		return NextResponse.json(
			{ error: "Failed to retrieve video information", details: err.message },
			{ status: 500 },
		);
	}
}

/**
 * Get;s the id from a youtube link
 *
 * @param {string} url - The input string to extract id from
 * @returns {string} the id
 *
 * @example
 * // returns "K-2pXMP3uu4"
 * extractId("https://youtu.be/K-2pXMP3uu4?si=TIN4XxcbS0bMea-3");
 *
 * @example
 * // returns "xuLfu0z5_m0"
 * extractId("https://www.youtube.com/shorts/xuLfu0z5_m0");
 *
 * @example
 * // returns "xuLfu0z5_m0"
 * extractId("xuLfu0z5_m0");
 *
 * @example
 * // returns null
 * extractId();
 */
function extractId(url: string): string | null {
	if (!url) return null;

	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}
