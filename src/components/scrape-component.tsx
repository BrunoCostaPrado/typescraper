/** biome-ignore-all lint/suspicious/noExplicitAny: <it works> */
"use client"

import { useEffect, useState } from "react"
import z from "zod"
// import { z } from "zod/v4-mini"
import { scrapeUrl } from "@/app/actions/scrape"

// Define the type for the component props
const ScrapeTypes = z.object({
	url: z.string(),
})
type ScrapeType = z.infer<typeof ScrapeTypes>

// Client component that calls server action for scraping
export function ScrapeComponent({ url }: { url: ScrapeType }) {
	const [scrapingResult, setScrapingResult] = useState<any | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const scrape = async () => {
			setIsLoading(true)
			setError(null)

			try {
				console.log(` Client: Requesting scrape for: ${url.url}`)

				const result = await scrapeUrl(url.url)

				if (result.success) {
					setScrapingResult(result.data)
				} else {
					setError(result.error || "Unknown error occurred")
				}
			} catch (error: any) {
				console.error(" Client: Scraping error:", error)
				setError(error.message || "Failed to scrape URL")
			} finally {
				setIsLoading(false)
			}
		}

		if (url.url) {
			scrape()
		}
	}, [url.url])

	return (
		<div className="text-white">
			{error && (
				<div className="rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-red-200">
					<strong>Error:</strong> {error}
				</div>
			)}
			{isLoading && (
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
					<span>Loading scraping results...</span>
				</div>
			)}
			{scrapingResult && !isLoading && (
				<div className="space-y-2">
					<div className="mb-2 text-green-400 text-sm">
						✓ Scraping completed successfully
					</div>
					<pre className="max-h-96 overflow-auto rounded-lg bg-black/30 p-4 text-sm">
						{JSON.stringify(scrapingResult, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
