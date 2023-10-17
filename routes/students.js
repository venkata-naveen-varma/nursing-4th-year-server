import express from "express";
import {
    addStudent, deleteStudent,getStudent,
    getStudents, updateStudent, registerToHospital, registerToCommunity
} from "../controllers/students.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/list", Auth, getStudents);

router.post("/id", Auth, getStudent);

router.post("/add", Auth, addStudent);

router.post("/hospital", Auth, registerToHospital);

router.post("/community", Auth, registerToCommunity);

// router.post("/update", Auth, updateStudent);

router.post("/delete", Auth, deleteStudent);

export default router;
