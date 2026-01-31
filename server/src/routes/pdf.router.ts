import { Router } from "express";
import { handleOpenAiInput } from "../controller/chatBot.controller";
import fileUpload from "express-fileupload";
import { llmParser } from "../controller/pdf.controller";

const router = Router();

router.post("/uploadpdf", fileUpload(), llmParser);

export default router;
