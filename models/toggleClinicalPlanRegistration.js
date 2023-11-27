import mongoose from "mongoose";

const { Schema } = mongoose;

const ToggleClinicalPlanRegisterSchema = new mongoose.Schema({
    registration_open: { type: Boolean, default: false},
    updated_by: {type: Schema.Types.ObjectId, ref:"User"}
}, { timestamps: true });

const toggleClinicalPlanRegister = mongoose.model("toggleClinicalPlanRegister", ToggleClinicalPlanRegisterSchema);

export default toggleClinicalPlanRegister;
