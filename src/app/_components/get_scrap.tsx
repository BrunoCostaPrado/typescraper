"use client"

import { Input } from "@/components/ui/input"
import { ScrapeComponent } from "@/components/scrape-component"
import { api } from "@/trpc/react"
import { useState } from "react"

export function GetScrap() {
	const [fullHistory] = api.scrap.getLatest.useSuspenseQuery()

	const utils = api.useUtils()
	const [history, setHistory] = useState("")
	const [urlToScrape, setUrlToScrape] = useState<string | null>(null)

	const createHistory = api.scrap.create.useMutation({
		onSuccess: async () => {
			await utils.scrap.invalidate()
			setHistory("")
		},
	})

	return (
		<div className="w-full max-w-4xl">
			{fullHistory ? (
				<p className="truncate">Your most recent history: {fullHistory.url}</p>
			) : (
				<p>You have no history yet.</p>
			)}
			<form
				className="flex flex-col gap-2"
				onSubmit={(e) => {
					e.preventDefault()
					createHistory.mutate({ name: history })
					setUrlToScrape(history)
				}}
			>
				<Input
					className="w-full rounded-full bg-white/10 px-6 py-3 text-white placeholder:text-white/60"
					onChange={(e) => setHistory(e.target.value)}
					placeholder="URL"
					type="text"
					value={history}
				/>
				<button
					className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
					disabled={createHistory.isPending}
					type="submit"
				>
					{createHistory.isPending ? "Submitting..." : "Submit"}
				</button>
			</form>

			{urlToScrape && (
				<div className="mt-4">
					<ScrapeComponent url={{ url: urlToScrape }} />
				</div>
			)}
		</div>
	)
}
