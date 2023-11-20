import express from "express";
import {getClinicalPlans, addClinicalPlan, getSemOptions, setSemOptions, delSemOptions} from "../controllers/clinicalplan.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

// Clinical Plans
router.post("/getsemoptions", Auth, getSemOptions);
router.post("/", Auth, getClinicalPlans);
router.post("/register", Auth, addClinicalPlan);
router.post("/setsemoptions", Auth, setSemOptions);
router.post("/delsemoptions", Auth, delSemOptions);

export default router;
