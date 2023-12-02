import express from "express";
import {
    addAgency, deleteAgency, getAgencies, updateAgency, getAgency, agencyPlacements, toggleAgencyRegistration, agencyToggleDetails, importAgency
} from "../controllers/agency.js";
import Auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Agencies
router.get("/toggledetails", adminAuth, agencyToggleDetails);
router.post("/list", Auth, getAgencies);
router.post("/register", adminAuth, addAgency);
router.post("/id", Auth, getAgency);
router.post("/update", adminAuth, updateAgency);
router.post("/delete", adminAuth, deleteAgency); // For single delete
router.post("/placements", Auth, agencyPlacements);
router.post("/toggleagency", adminAuth, toggleAgencyRegistration);
router.post("/import", adminAuth, importAgency);

export default router;
