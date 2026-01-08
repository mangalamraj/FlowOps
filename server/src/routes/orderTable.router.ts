import { Router } from "express";
import { getAllOrders } from "../controller/orderTable.controller";

const router = Router();

router.get("/all", getAllOrders);

export default router;
