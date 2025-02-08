import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { url } = await req.json()

  // TODO: Implement actual YouTube video info retrieval logic here
  // This is a mock implementation
  const mockFormats = [
    { format: "MP4", quality: "720p", url: "https://example.com/video-720p.mp4" },
    { format: "MP4", quality: "1080p", url: "https://example.com/video-1080p.mp4" },
    { format: "WebM", quality: "480p", url: "https://example.com/video-480p.webm" },
  ]

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({ formats: mockFormats })
}

// import ytdl from "@distube/ytdl-core";
// import fs from 'node:fs';
// import path from 'node:path';

// // const ytdl = require('ytdl-core');
// const videoId = 'NHNp66iMMZA';

// // Function to sanitize file names
// function sanitizeFileName(name: string): string {
//   return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
// }

// // Get video info from YouTube
// ytdl.getInfo(videoId).then((info) => {

//   // const infoFilePath = path.join(__dirname, `${sanitizeFileName(info.videoDetails.title)}_info.json`);
//   // fs.writeFileSync(infoFilePath, JSON.stringify(info, null, 2), 'utf-8'); 
  
//   // Select the video format and quality
//   console.log(info.formats)
//   const format = ytdl.chooseFormat(info.formats,{format: {
//     codecs: 
//   }});
//   const sanitizedTitle = sanitizeFileName(info.videoDetails.title);
//   const outputFilePath = path.join(__dirname, `${sanitizedTitle}.${format.container}`);
//   // Create a write stream to save the video file
//   const outputStream = fs.createWriteStream(outputFilePath);
//   // Download the video file
//   // ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
//   // When the download is complete, show a message
//   outputStream.on('finish', () => {
//     console.log(`Finished downloading: ${outputFilePath}`);
//   });
// }).catch((err) => {
//   console.error(err);
// });