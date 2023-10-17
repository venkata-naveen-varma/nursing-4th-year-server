import express from "express";
import {
    addAgency, deleteAgency, getAgencies, updateAgency, getAgency
} from "../controllers/agency.js";

const router = express.Router();

// Agencies
router.post("/list", getAgencies);
router.post("/register", addAgency);
router.post("/id", getAgency);
router.post("/update", updateAgency);
router.post("/delete", deleteAgency); // For single delete

export default router;
