import express from "express";
import {getClinicalPlans, addClinicalPlan} from "../controllers/clinicalplan.js";

const router = express.Router();

// Clinical Plans
router.post("/", getClinicalPlans);
router.post("/register", addClinicalPlan);

export default router;
