"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSchema = void 0;
const zod_1 = require("zod");
exports.requestSchema = zod_1.z.object({
    url: zod_1.z.string(),
    params: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: zod_1.z.string() })),
    headers: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: zod_1.z.string() })),
    body: zod_1.z.string(),
    contentType: zod_1.z.string(),
    requestType: zod_1.z.string(),
});
