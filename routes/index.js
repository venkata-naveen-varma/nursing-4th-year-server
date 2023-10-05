import express from "express";
import auth from "../middleware/auth.js";

import UserRoutes from "./user.js";
import HospitalRoutes from "./hospitals.js";
import SchoolsRoutes from "./schools.js";
import InstructorRoutes from "./instructors.js";
import LocationRoutes from "./placement-locations.js";
import StudentRoutes from "./students.js";
import PlacementRoutes from "./placements.js";
import AgencyRoutes from "./agency.js";
import ClinicalPlanRoutes from "./clinicalplan.js";
// import AdminRoutes from "./admin.js";

const router = express.Router();

router.use("/user", UserRoutes);

router.use("/agency", auth, AgencyRoutes);

router.use("/student", auth, StudentRoutes);

router.use("/clinicalplan", auth, ClinicalPlanRoutes);

// router.use("/hospitals", auth, HospitalRoutes);

// router.use("/schools", auth, SchoolsRoutes);

// router.use("/instructors", auth, InstructorRoutes);

// router.use("/locations", auth, LocationRoutes);

// router.use("/placements", auth, PlacementRoutes);

export default router;
