import { Router } from "express";
import { handleOpenAiInput } from "../controller/chatBot.controller";

const router = Router();

router.post("/getresponse", handleOpenAiInput);

export default router;
