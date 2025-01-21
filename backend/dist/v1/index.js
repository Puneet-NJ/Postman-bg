"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("../lib/types/zod");
const axios_1 = __importDefault(require("axios"));
const dummy_1 = require("./routes/dummy");
exports.router = (0, express_1.Router)();
exports.router.use("/dummy", dummy_1.dummyRoutes);
exports.router.post("/request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateInput = zod_1.requestSchema.safeParse(req.body);
        if (!validateInput.success) {
            res.status(411).json({ msg: "Invalid Inputs" });
            return;
        }
        const { url, body, headers, params, contentType, requestType } = validateInput.data;
        let modifiedUrl = url;
        if (params.length > 0) {
            modifiedUrl += "?";
            params.forEach((param, index) => {
                if (index !== 0)
                    modifiedUrl += "&";
                modifiedUrl += param.key + "=" + param.value;
            });
        }
        let modifiedHeaders = {};
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
        console.log("requestType ", requestType);
        let urlResponse;
        let options = {
            url: modifiedUrl,
            method: requestType,
            headers: Object.assign({ "Content-Type": modifiedContentType }, modifiedHeaders),
        };
        if (requestType !== "GET") {
            options = Object.assign(Object.assign({}, options), { data: body });
        }
        try {
            urlResponse = yield (0, axios_1.default)(options);
        }
        catch (err) {
            // console.log(err);
            res.status(500).json({ msg: JSON.stringify(err) });
            return;
        }
        res.json({ data: urlResponse.data, status: urlResponse.status });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
