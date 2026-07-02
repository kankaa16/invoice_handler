import express from "express";
import {whatsapp_webhook} from "../controllers/whatsappController.js";

const router=express.Router();

router.post("/",whatsapp_webhook);

export default router;