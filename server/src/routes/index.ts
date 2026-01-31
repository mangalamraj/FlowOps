import { Router } from "express";
import tableRouter from "./orderTable.router";
import botRouter from "./bot.router";
import pdfRouter from "./pdf.router";
import labelRouter from "./label.router";
const router = Router();

router.use("/table", tableRouter);
router.use("/bot", botRouter);
router.use("/pdf", pdfRouter);
router.use("/label", labelRouter);
// router.use("/")

export default router;
