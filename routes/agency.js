import express from "express";
import {
    addAgency, deleteAgency, getAgencies, updateAgency, getAgency
} from "../controllers/agency.js";

const router = express.Router();

// Agencies
router.post("/list", getAgencies);
router.post("/register", addAgency);
router.post("/id", getAgency);
// router.post("/import", importAgency);
router.post("/update", updateAgency);
router.post("/delete", deleteAgency); // For single delete
// router.post("/deleteAll", deleteAgencies); // For multiple delete

// Community Clinics
// router.get("/communities", getAgencies);
// router.get("/community/:id", getAgency);
// router.post("/community", addAgency);
// router.post("/community/import", importAgency);
// router.patch("/community/:id", updateAgency);
// router.delete("/community/:id", deleteAgency); // For single delete
// router.post("/community/delete", deleteAgencies); // For multiple delete

export default router;
