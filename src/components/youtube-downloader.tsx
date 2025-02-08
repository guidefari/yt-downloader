"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface VideoFormat {
  format: string
  quality: string
  url: string
}

export default function YouTubeDownloader() {
  const [url, setUrl] = useState("")
  const [formats, setFormats] = useState<VideoFormat[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setFormats([])
    setErrorMessage("")

    try {
      const response = await fetch("/api/youtube-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch video information")
      }

      const data = await response.json()
      setFormats(data.formats)
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Video Downloader</CardTitle>
        <CardDescription>Paste a YouTube URL to get download links</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

        {status === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {status === "success" && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Video information retrieved successfully.</AlertDescription>
          </Alert>
        )}

        {formats.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Available Formats:</h3>
            <ul className="space-y-2">
              {formats.map((format, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    {format.format} - {format.quality}
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <a href={format.url} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

