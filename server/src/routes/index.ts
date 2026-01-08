import { Router } from "express";
import tableRouter from "./orderTable.router";
import botRouter from "./bot.router";
const router = Router();

router.use("/table", tableRouter);
router.use("/bot", botRouter);

export default router;
