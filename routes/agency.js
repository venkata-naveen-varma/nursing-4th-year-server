import express from "express";
import {
    addAgency, deleteAgency, getAgencies, updateAgency, getAgency
} from "../controllers/agency.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

// Agencies
router.post("/list", Auth, getAgencies);
router.post("/register", Auth, addAgency);
router.post("/id", Auth, getAgency);
router.post("/update", Auth, updateAgency);
router.post("/delete", Auth, deleteAgency); // For single delete

export default router;
