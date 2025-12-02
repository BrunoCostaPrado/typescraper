import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { history } from "@/server/db/schema"

export const scrapRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			}
		}),

	create: publicProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(history).values({
				url: input.name,
			})
		}),

	getLatest: publicProcedure.query(async ({ ctx }) => {
		const hist = await ctx.db.query.history.findFirst({
			orderBy: (history, { desc }) => [desc(history.createdAt)],
		})

		return hist ?? null
	}),
})
