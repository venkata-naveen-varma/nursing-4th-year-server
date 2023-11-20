import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const { Schema } = mongoose;

const semesterOptionsSchema = new Schema({
    field: { type: String, required: true, trim: true},
    seats: {type: Number, required: true},
    seats_filled: {type: Number, required: true, default: 0}

    /* This schema is for the clinical plan page Semester Sequence:
    Please select the semester sequence for your clinical schedule:
    */
}, { timestamps: true });

const SemesterOptions = mongoose.model("SemesterOptions", semesterOptionsSchema);

export default SemesterOptions;
