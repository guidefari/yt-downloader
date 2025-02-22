"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { AudioFormat, VideoInfo } from "@/types";
import { toast, Toaster } from "sonner";

export default function Home() {
	const [url, setUrl] = useState("");
	const [formats, setFormats] = useState<AudioFormat[] | null>();
	const [deets, setDeets] = useState<VideoInfo | null>();
	const [progress, setProgress] = useState(0);

	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		setFormats(null);
		setErrorMessage("");

		try {
			const response = await fetch("/api/youtube-info", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch video information");
			}

			const data: VideoInfo = await response.json();
			setFormats(data.formats);
			setDeets(data);
			setStatus("success");
			toast.success("Video information retrieved successfully");
		} catch (error) {
			setStatus("error");
			const errorText =
				error instanceof Error ? error.message : "An unknown error occurred";

			setErrorMessage(errorText);
			toast.error("oops", {
				description: errorText,
			});
		}
	};

	async function handleDownload(url: string) {
		const res = await fetch(
			"https://pqaqeg2yyn3fyw2kbrs4s6e2ii0trnro.lambda-url.us-east-1.on.aws/",
			{
				method: "POST",
				body: JSON.stringify({
					title: deets?.title,
					url,
					email: "guideg6@gmail.com",
				}),
			},
		);
	}

	return (
		<>
			<div className="w-full max-w-xl mx-auto p-6 flex flex-col justify-between min-h-screen">
				<div>
					<h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
						YouTube Video Downloader{" "}
					</h2>
					<p className="text-lg sm:text-xl mb-8 text-gray-300">
						(for research purposes👀)
					</p>
				</div>

				<div className="flex-1 items-center justify-center">
					<form onSubmit={handleSubmit} className="space-y-4 w full">
						<div className="flex space-x-2">
							<Input
								type="url"
								placeholder="https://www.youtube.com/watch?v=..."
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
							/>
							<Button type="submit" disabled={status === "loading"}>
								{status === "loading" ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processing
									</>
								) : (
									"Get Links"
								)}
							</Button>
						</div>
					</form>

					{formats && deets && formats.length > 0 && (
						<div className="mt-4">
							<h2>{deets.title}</h2>
							<iframe
								src={deets.embed.iframeUrl}
								width={deets.embed.width}
								height={deets.embed.height}
								allowFullScreen
								className="w-full h-auto"
								style={{ border: "none" }}
								title={deets?.title}
							/>

							<h3 className="text-lg font-semibold mb-2">Available Formats:</h3>
							<ul className="space-y-2">
								{formats.map((format, index) => (
									<li
										key={`${format.url.slice(-25)} - ${index}`}
										className="flex gap-9 items-center"
									>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDownload(format.url)}
										>
											Download
										</Button>
										<span>
											{format.mimeType} -{" "}
											{(format.contentLength / (1024 * 1024)).toFixed(2)} MB
										</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
			<Toaster />
		</>
	);
}
