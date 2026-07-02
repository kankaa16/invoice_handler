import express from "express";

import {weekly_payment_schedule, weekly_collection_followup} from "../controllers/reportController.js";

const router=express.Router();

router.get(
  "/payment/:customer",
  weekly_payment_schedule
);

router.get(
  "/collection/:customer",
  weekly_collection_followup
);

export default router;