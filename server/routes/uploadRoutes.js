import express from "express";

import upload from "../middleware/upload.js";
import { upload_sheet} from "../controllers/uploadController.js";

const router=express.Router();
//.single coz expects single file only at once!
router.post("/", upload.single("sheet"), upload_sheet);

export default router;