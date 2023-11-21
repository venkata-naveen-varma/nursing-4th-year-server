import express from "express";
import {
    addStudent, deleteStudent,getStudent, getStudents, updateStudent, registerToHospital, registerToCommunity, studentPlacements, placementTypes, agencyNames
} from "../controllers/students.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/list", Auth, getStudents);
router.post("/id", Auth, getStudent);
router.post("/hospital", Auth, registerToHospital);
router.post("/community", Auth, registerToCommunity);
router.post("/placements", Auth, studentPlacements);
router.post("/placementTypes", Auth, placementTypes);
router.post("/addstudent", Auth, addStudent);
router.post("/delete", Auth, deleteStudent);
router.post("/agencyNames", Auth, agencyNames);
// router.post("/update", Auth, updateStudent);

export default router;
