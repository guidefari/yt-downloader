import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "ytdl@home",
	description: "There's youtube downloader at home",
	icons: {
		icon: "/favicon.svg",
	},
  openGraph: {
    images: [
      {
        url: '/api/og', // Path to your OG image API route
        width: 1200,
        height: 630,
        alt: 'There\'s youtube downloader at home',
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
		<html lang="en">
			<body className="min-h-100dvh">{children}</body>
		</html>
	);
}
