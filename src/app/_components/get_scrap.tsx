"use client"

import { useState } from "react"
import { api } from "@/trpc/react"

export function GetScrap() {
	const [fullHistory] = api.scrap.getLatest.useSuspenseQuery()

	const utils = api.useUtils()
	const [history, setHistory] = useState("")
	const createHistory = api.scrap.create.useMutation({
		onSuccess: async () => {
			await utils.post.invalidate()
			setHistory("")
		},
	})

	return (
		<div className="w-full max-w-xs">
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
				}}
			>
				<input
					className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
					onChange={(e) => setHistory(e.target.value)}
					placeholder="Title"
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
		</div>
	)
}
