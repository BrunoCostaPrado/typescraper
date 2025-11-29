import { ScrapeConfig, type ScrapeResult, ScrapflyClient } from "scrapfly-sdk";

import { env } from "@/env";

const key = env.SCRAPFLY;

const client = new ScrapflyClient({ key });
const result: ScrapeResult = await client.scrape(
	new ScrapeConfig({
		url: "https://web-scraping.dev/product/1",
	}),
);
// const apiResponse = await client.scrape(
// 	new ScrapeConfig({
// 		url: "https://web-scraping.dev/product/1",
// 		// optional parameters:
// 		// enable javascript rendering
// 		render_js: true,
// 		// set proxy country
// 		country: "us",
// 		// enable anti-scraping protection bypass
// 		asp: true,
// 		// set residential proxies
// 		proxy_pool: "public_residential_pool",
// 		// etc.
// 		debug: true,
// 	}),
// );
// console.log(apiResponse.result.content); // html content
// // Parse HTML directly with SDK (through cheerio)
// console.log(apiResponse.result.selector("h3").text());
console.log({
	name: result.selector("h3").first().text(),
	price: result.selector(".price>span").text(),
	"price-full": result.selector(".product-price-full").text(),
	description: result.selector(".product-description").text(),
});
