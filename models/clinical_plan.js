import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const { Schema } = mongoose;

const ClinicalPlanSchema = new Schema({
    studentId: { type: String, required: true, trim: true},
    student_object: {type: Schema.Types.ObjectId, ref: "Student"},
    begin_nursing_site: {type: String, required: true},
    completing_nursing_site: {type: String, required: true},
    semester_sequence: {type: String, required: true},
    preffered_hospital_location: {type: String, required: true},
    preffered_community_location: {type: String, required: true}

    /* This schema is for the clinical plan page fields:
    Student details
    At which site did you begin your nursing?
    At which site will you be completing your final term of the nursing program?
    Please select the semester sequence for your clinical schedule:
    Preferred placement location for Hospital Clinical:
    Preferred placement location for Community Clinical
    */
}, { timestamps: true });

const ClinicalPlan = mongoose.model("ClinicalPlan", ClinicalPlanSchema);

export default ClinicalPlan;
