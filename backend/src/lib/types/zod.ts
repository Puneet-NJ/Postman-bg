import { z } from "zod";

export const requestSchema = z.object({
	url: z.string(),
	params: z.array(z.object({ key: z.string(), value: z.string() })),
	headers: z.array(z.object({ key: z.string(), value: z.string() })),
	body: z.string(),
	contentType: z.string(),
	requestType: z.string(),
});
