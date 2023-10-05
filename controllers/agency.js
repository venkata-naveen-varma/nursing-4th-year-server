import mongoose from "mongoose";
import Agency from "../models/agency.js";
import User from "../models/users.js";

export const getAgencies = async (req, res) => {
    try {
        const user_details = await User.findById(req.user);
        const agency_type = req.body.type;
        if(!agency_type){
            return res
                .status(400)
                .json({ message: "agency_type is missing!" });
        }
        if(!user_details){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        let agencies, totalCount;
        if(user_details.type == "student"){
            agencies = await Agency.find({visibility: true, agency_type: agency_type}, {_id: 1, name: 1, placement_type: 1})
            .sort({ createdAt: -1 });
        }else{
            agencies = await Agency.find({agency_type: agency_type}, {_id: 1, name: 1, placement_type: 1})
            .sort({ createdAt: -1 });
        }
        totalCount = agencies.length;
        res.status(200).json({
            data: agencies,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getAgency = async (req, res) => {
    try {
        const {id} = req.body;
        if(!id){
            return res
                .status(400)
                .json({ message: "Invalid data provided" });
        }
        const agency = await Agency.findById(id);
        if(!agency){
            return res
                .status(400)
                .json({ message: "Requested agency does not exist." });
        }
        res.status(200).json(agency);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addAgency = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if(!user){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        if(user.type == "student"){
            res.status(401).json({message: "Unauthorized access!"});
        }
        const { name, agency_type, placement_type} = req.body;
        const existingAgency = await Agency.findOne({ name, placement_type, agency_type});
        if (existingAgency) {
            return res
                .status(400)
                .json({ message: "Agency already exists." });
        }
        req.body["current_capacity"] = req.body.total_capacity
        const agency = new Agency(req.body);
        await agency.save();
        res.status(201).json(agency);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// export const importAgency = async (req, res) => {
//     try {
//         const { body } = req;
//         await agency.insertMany(body);
//         res.json({ message: " Uploaded successfully." });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

export const updateAgency = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if(!user){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        if(user.type == "student"){
            res.status(401).json({message: "Unauthorized access!"});
        }
        const {id} = req.body;
        const { body } = req;

        if(!id){
            return res
                .status(400)
                .json({ message: "Invalid data provided" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No entry found with id: ${id}` });

        const agency = await Agency.findByIdAndUpdate(id, body, { new: true });
        if(!agency){
            return res
                .status(400)
                .json({ message: "Requested agency does not exist." });
        }
        res.status(200).json(agency);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const deleteAgency = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if(!user){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        if(user.type == "student"){
            res.status(401).json({message: "Unauthorized access!"});
        }
        const id = req.body._id;
        agency = await Agency.findByIdAndDelete(id);
        if(!agency){
            return res
                .status(400)
                .json({ message: "Requested agency does not exist." });
        }
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// export const deleteAgencies = async (req, res) => {
//     const { body } = req;
//     try {
//         await Agency.deleteMany({ _id: { $in: body } });
//         res.json({ message: "Agencies deleted successfully." });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };
