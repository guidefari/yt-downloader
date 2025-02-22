import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const mono = Space_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "ytdl@home",
	description: "There's youtube downloader at home",
	icons: {
		icon: "/favicon.svg",
	},
	openGraph: {
		images: [
			{
				url: "/api/og", // Path to your OG image API route
				width: 1200,
				height: 630,
				alt: "There's youtube downloader at home",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={mono.className}>
			<body className="min-h-dvh p-1 flex">{children}</body>
		</html>
	);
}
