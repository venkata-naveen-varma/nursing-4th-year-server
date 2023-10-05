import express from "express";
import {
    addStudent, deleteStudent,getStudent,
    getStudents, updateStudent, getStudentPlacements
} from "../controllers/students.js";

const router = express.Router();

router.get("/list", getStudents);

router.post("/id", getStudent);

// router.get("/:id/placements", getStudentPlacements);

router.post("/add", addStudent);

// router.post("/import", importStudents);

// router.post("/update", updateStudent);

router.post("/delete", deleteStudent); // For single deletion

// router.post("/delete", deleteStudents); // For multiple deletion

export default router;
