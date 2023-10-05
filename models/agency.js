import mongoose from "mongoose";

const AgencySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    placement_type: {type: String, required: true, trim: true},
    agency_type: {type: String, enum: ["hospital", "community"], required: true, trim: true},
    address: { type: String, trim: true },
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    student_roles: { type: String, trim: true },
    lab_practice_required: { type: Boolean, required: true},
    required_readings: { type: String, trim: true },
    car_needed: { type: Boolean, Default: false},
    languages: { type: String, trim: true },
    police_clearance: { type: String, trim: true },
    total_capacity: {type: Number, required: true},
    current_capacity: {type: Number,required: true},
    attached_file: {type: String, trim: true}, // upload file in a cloud storage and store the location in the DB
    visibility: {type: Boolean, default: true}
}, { timestamps: true });

const Agency = mongoose.model("Agency", AgencySchema);

export default Agency;
