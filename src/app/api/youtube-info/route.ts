import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import fs from "node:fs";
import path from "node:path";

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
    // return NextResponse.json(info)

		const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
		// const formats = [...info.player_response.streamingData.formats, ...info.player_response.streamingData.adaptiveFormats]
		// const audioFormats = filterAudioFormats(formats)

		// ytdl.getInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ").then(info => {
		// })
		// return NextResponse.json({...info.player_response.streamingData.formats, ...info.player_response.streamingData.adaptiveFormats})
		return NextResponse.json(

			{
        title: info.videoDetails.title,
        embed: info.videoDetails.embed,
        formats: audioFormats.map(
				({
					audioBitrate,
					url,
					mimeType,
					contentLength,
					approxDurationMs,
					codecs,
          container

				}) => ({
					audioBitrate,
					codecs,
					mimeType: container,
					url,
					contentLength,
					approxDurationMs,
				}),
			)},
		);

		// const infoFilePath = path.join(__dirname, `${sanitizeFileName(info.videoDetails.title)}_info.json`);
		// fs.writeFileSync(infoFilePath, JSON.stringify(info, null, 2), 'utf-8');

		// Select the video format and quality
		//   const format = ytdl.chooseFormat(info.formats,
		//   //   {format: {
		//   //   codecs:
		//   // }}
		// );

		// const sanitizedTitle = sanitizeFileName(info.videoDetails.title);
		// const outputFilePath = path.join(__dirname, `${sanitizedTitle}.${format.container}`);
		// Create a write stream to save the video file
		// const outputStream = fs.createWriteStream(outputFilePath);
		// Download the video file
		// ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
		// When the download is complete, show a message
		// outputStream.on('finish', () => {
		//   console.log(`Finished downloading: ${outputFilePath}`);
		// });
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

// TODO: Implement actual YouTube video info retrieval logic here
// This is a mock implementation
// const mockFormats = [
//   { format: "MP4", quality: "720p", url: "https://example.com/video-720p.mp4" },
//   { format: "MP4", quality: "1080p", url: "https://example.com/video-1080p.mp4" },
//   { format: "WebM", quality: "480p", url: "https://example.com/video-480p.webm" },
// ]

// // Simulate API delay
// await new Promise((resolve) => setTimeout(resolve, 1000))

// return NextResponse.json({ formats: mockFormats })
// }

// function sanitizeFileName(name: string): string {
//   return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
// }

// function filterAudioFormats(data: any): any[] {
//   console.log('data:', data)
//   return data.filter((format: any) =>
//       format.mimeType.startsWith("audio/")
//   );
// }

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
