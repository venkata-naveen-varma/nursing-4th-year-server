import mongoose from "mongoose";
import Agency from "../models/agency.js";
import User from "../models/users.js";
import ToggleAgencyRegister from "../models/toggleAgencyRegistration.js";

export const getAgencies = async (req, res) => {
    try {
        const user_details = req.session.user;
        const agency_type = req.body.type;
        if(!agency_type){
            return res
                .status(400)
                .json({ message: "agency_type is missing!" });
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
        return res.status(200).json({
            data: agencies,
            totalCount
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
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
        return res.status(200).json(agency);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const addAgency = async (req, res) => {
    try {
        const user = req.session.user;
        if(user.type == "student"){
            return res.status(401).json({message: "Unauthorized access!"});
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
        return res.status(201).json(agency);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateAgency = async (req, res) => {
    try {
        const user = req.session.user;
        if(user.type == "student"){
            return res.status(401).json({message: "Unauthorized access!"});
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
        return res.status(200).json(agency);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
export const deleteAgency = async (req, res) => {
    try {
        const user = req.session.user;
        if(user.type == "student"){
            return res.status(401).json({message: "Unauthorized access!"});
        }
        const id = req.body._id;
        const agency = await Agency.findByIdAndDelete(id);
        if(!agency){
            return res
                .status(400)
                .json({ message: "Requested agency does not exist." });
        }
        return res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// get lsit of placements of an agency
export const agencyPlacements = async (req, res) => {
    try {
        const user = req.session.user;

        if(user.type == "student"){
            // if request is from student
            return res.status(400).json({"message": "Unauthorized user!"});
        }
        const {id} = req.body;
        const agency = await Agency.findById(id, 'name placement_type agency_type')
        .sort({createdAt: -1})
        .populate({path: 'placements.student', select: ['studentId','fname','lname','email','year','term']});
        const total_count = agency.placements.length;
        if(total_count==0){
            return res.status(200).json({agency, total_count, "message": "No placements"});
        }
        return res.status(200).json({agency, total_count, msg: "list of placements of requested agency"});
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// ON/OFF hosiptal/community registration
export const toggleAgencyRegistration = async (req, res) => {
    try{
        const user = req.session.user;
        const {hospital, community} = req.body;
        req.body.updated_by = user._id;
        if(hospital && (!(typeof(hospital) == "boolean"))){
            return res.status(400).json({"message": "Invalid data provided"});
        }
        if(community && (!(typeof(community) == "boolean"))){
            return res.status(400).json({"message": "Invalid data provided"});
        }
        const toggleObj = await ToggleAgencyRegister.findOneAndUpdate({}, req.body, {returnOriginal: false});
        if(!toggleObj){
            return res.status(400).json({message: "Update Unsuccessfull"});
        }
        return res.status(200).json({data: toggleObj, message: "Updated Successfully"});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
};

// get details of agency toggle
export const agencyToggleDetails = async (req, res) => {
    try{
        const toggleDetails = await ToggleAgencyRegister.findOne({});
        return res.status(200).json({data: toggleDetails});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
};
