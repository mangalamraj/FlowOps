import { Router } from "express";
import uploadLabel from "../controller/label.controller";
import fileUpload from "express-fileupload";

const router = Router();

router.post("/upload", fileUpload(), uploadLabel);

export default router;
