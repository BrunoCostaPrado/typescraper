"use server"

import { ScrapeConfig, ScrapflyClient } from "scrapfly-sdk"

import { env } from "@/env"

/**
 * Server action to scrape a URL using Scrapfly
 * This keeps the API key secure on the server
 */

export async function scrapeUrl(url: string) {
	try {
		// Validate URL format
		new URL(url)

		// Get API key from server-side environment variable
		const scrapflyKey = env.SCRAPFLY

		if (!scrapflyKey) {
			return {
				success: false,
				error:
					"SCRAPFLY_API_KEY not configured. Please add it to your environment variables in the Vars section.",
			}
		}

		//Scrapfly scraping

		const client = new ScrapflyClient({ key: scrapflyKey })
		const result = await client.scrape(
			new ScrapeConfig({
				url,
				render_js: true,
				asp: true,
				proxy_pool: "public_residential_pool",
				debug: true,
			})
		)

		return {
			success: true,
			data: {
				name: result.selector("h1").first().text(),
				html: result.result.content,
			},
		}
		// biome-ignore lint/suspicious/noExplicitAny: <it works>
	} catch (error: any) {
		console.error(" Server: Scraping error:", error)
		return {
			success: false,
			error: error.message || "Failed to scrape URL",
		}
	}
}
