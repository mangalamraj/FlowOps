import { Router } from "express";
import {
  addTags,
  getAllOrders,
  getDimensions,
  getRules,
  setVerificationStatus,
  uploadOrders,
} from "../controller/orderTable.controller";
import { upload } from "../middleware/multer.middlware";

const router = Router();

router.get("/all", getAllOrders);
router.post("/upload", upload.single("file"), uploadOrders);
router.post("/addTags", addTags);
router.get("/getrules", getRules);
router.get("/getdimensions", getDimensions);
router.post("/setstatus", setVerificationStatus);

export default router;
