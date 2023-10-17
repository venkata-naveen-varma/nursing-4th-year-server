import express from "express";

import UserRoutes from "./user.js";
import StudentRoutes from "./students.js";
import AgencyRoutes from "./agency.js";
import ClinicalPlanRoutes from "./clinicalplan.js";
// import AdminRoutes from "./admin.js";

const router = express.Router();

router.use("/user", UserRoutes);

router.use("/agency", AgencyRoutes);

router.use("/student", StudentRoutes);

router.use("/clinicalplan", ClinicalPlanRoutes);

export default router;
