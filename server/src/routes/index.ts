import { Router } from "express";
import tableRouter from "./orderTable.router";
const router = Router();

router.use("/table", tableRouter);

export default router;
