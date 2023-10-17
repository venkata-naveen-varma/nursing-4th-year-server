import express from "express";
import {getClinicalPlans, addClinicalPlan} from "../controllers/clinicalplan.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

// Clinical Plans
router.post("/", Auth, getClinicalPlans);
router.post("/register", Auth, addClinicalPlan);

export default router;
