import express from "express";
import {getClinicalPlans} from "../controllers/clinicalplan.js";

const router = express.Router();

// Agencies
router.get("/", getClinicalPlans);
// router.get("/agency/:id", getAgency);
// router.post("/agency", addAgency);
// router.post("/agency/import", importAgency);
// router.patch("/agency/:id", updateAgency);
// router.delete("/agency/:id", deleteAgency); // For single delete
// router.post("/agency/delete", deleteAgencies); // For multiple delete

export default router;
