import mongoose from "mongoose";

const { Schema } = mongoose;

const ToggleAgencyRegisterSchema = new mongoose.Schema({
    hospital: { type: Boolean, default: false},
    community: { type: Boolean, default: false},
    updated_by: {type: Schema.Types.ObjectId, ref:"User"}
}, { timestamps: true });

const toggleAgencyRegister = mongoose.model("toggleAgencyRegister", ToggleAgencyRegisterSchema);

export default toggleAgencyRegister;
