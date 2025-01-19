import { Router } from "express";
import { requestSchema } from "../lib/types/zod";
import axios from "axios";

export const router = Router();

router.post("/request", async (req, res) => {
	try {
		const validateInput = requestSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid Inputs" });
			return;
		}

		const { url, body, headers, params, contentType, requestType } =
			validateInput.data;

		let modifiedUrl: string = url;
		if (params.length > 0) {
			modifiedUrl += "?";

			params.forEach((param, index) => {
				if (index !== 0) modifiedUrl += "&";

				modifiedUrl += param.key + "=" + param.value;
			});
		}

		let modifiedHeaders: { [key: string]: string } = {};
		headers.forEach((header) => {
			modifiedHeaders[header.key] = header.value;
		});

		let modifiedContentType = "";
		switch (contentType) {
			case "json":
				modifiedContentType = "application/json";
				break;

			case "text":
				modifiedContentType = "text/plain";
				break;

			case "xml":
				modifiedContentType = "application/xml";
				break;

			case "html":
				modifiedContentType = "text/html";
				break;
		}

		console.log("url ", modifiedUrl);
		console.log("headers ", modifiedHeaders);
		console.log("contentType ", modifiedContentType);
		console.log("body ", body);

		let urlResponse;
		try {
			urlResponse = await axios({
				url: modifiedUrl,
				method: requestType,
				data: body,
				headers: {
					"Content-Type": modifiedContentType,
					...modifiedHeaders,
				},
			});
		} catch (err) {
			res.status(500).json({ msg: JSON.stringify(err) });
			return;
		}

		res.json({ data: urlResponse.data, status: urlResponse.status });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Internal Server Error" });
	}
});
