import { Router } from "express";
import {
  getAllOrders,
  uploadOrders,
} from "../controller/orderTable.controller";
import { upload } from "../middleware/multer.middlware";

const router = Router();

router.get("/all", getAllOrders);
router.post("/upload", upload.single("file"), uploadOrders);

export default router;
