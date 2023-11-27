import express from "express";
import {getClinicalPlans, addClinicalPlan, getSemOptions, setSemOptions, delSemOptions, toggleClinicalPlanRegistration, clinicalPlanToggleDetails} from "../controllers/clinicalplan.js";
import Auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Clinical Plans
router.get("/toggledetails", adminAuth, clinicalPlanToggleDetails);
router.post("/getsemoptions", Auth, getSemOptions);
router.post("/", Auth, getClinicalPlans);
router.post("/register", Auth, addClinicalPlan);
router.post("/setsemoptions", Auth, setSemOptions);
router.post("/delsemoptions", Auth, delSemOptions);
router.post("/toggleregister", adminAuth, toggleClinicalPlanRegistration);

export default router;
