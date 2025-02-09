import { ImageResponse } from "next/og";

export async function GET() {
	return new ImageResponse(
		<div
			tw="bg-black"
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<h2 tw="flex flex-col text-5xl font-bold tracking-tight text-white text-left">
				There's youtube downloader at home👀
			</h2>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}
