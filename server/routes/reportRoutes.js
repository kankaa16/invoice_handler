import express from "express";

import {weekly_payment_schedule} from "../controllers/reportController.js";

const router=express.Router();

router.get(
  "/payment/:customer",
  weekly_payment_schedule
);

export default router;