import { api, HydrateClient } from "@/trpc/server"

import { GetScrap } from "./_components/get_scrap"

export const dynamic = "force-dynamic"
export default async function Home() {
	void api.scrap.getLatest.prefetch()

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<GetScrap />
				</div>
			</main>
		</HydrateClient>
	)
}
