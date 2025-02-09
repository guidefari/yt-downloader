import { ImageResponse } from "next/og";

export async function GET() {
	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "white",
			}}
		>
			<div tw="bg-gray-50 flex">
				<h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
          There's youtube downloader at home👀
        </h2>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}
