import mongoose from "mongoose";

const { Schema } = mongoose;

const PlacementSchema = new Schema({
    name: { type: String, required: true, trim: true },
    term: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    placements: [{
        studentId: { type: Schema.Types.ObjectId, ref: "Student" },
        agencyId: {
            type: Schema.Types.ObjectId, ref: "Agency", required: false, default: null
        },
        notes: { type: String, default: "" }
    }],
    status: { type: String, required: true, default: "applied" }
}, { timestamps: true });

const Placement = mongoose.model("Placement", PlacementSchema);

export default Placement;
