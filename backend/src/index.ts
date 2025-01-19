import express from "express";
import { router } from "./v1";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.listen(9843);
