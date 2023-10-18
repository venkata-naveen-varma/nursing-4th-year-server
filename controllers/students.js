import mongoose from "mongoose";
import Student from "../models/students.js";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import Agency from "../models/agency.js";

export const getStudents = async (req, res) => {
    try {
        const user_data = req.session.user;
        if(user_data.type == "student"){
            return res.status(401).json({message: "Unauthorized access!"});
        }
        else{
            const {
                index, limit, term, year
            } = req.query;
    
            const findParams = {};
            if (term) {
                findParams.term = term;
            }
    
            if (year) {
                findParams.year = year;
            }
    
            const Studentrec = await Student.find(findParams)
                .sort({ createdAt: -1 })
                // .limit(limit)
                // .skip(index);
                // .populate("school");
    
            const totalCount = await Student.find(findParams).count();
    
            return res.status(200).json({
                data: Studentrec,
                totalCount
            });
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const getStudent = async (req, res) => {
    try {
        const { id } = req.body;

        if(!id){
            return res
                .status(400)
                .json({ message: "Invalid data provided" });
        }

        const Studentrec = await Student.findById(id)
            // .populate("clinicalPlanHistory")
            // .populate("placementLocationsHistory")
            // .populate({
            //     path: "placementLocationsHistory",
            //     populate: [{ path: "hospital" }, { path: "instructor" }]
            // })
            // .populate("placementsHistory");
        // .populate("school");

        return res.status(200).json(Studentrec);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const addStudent = async (req, res) => {
    try {
        const user_data = req.session.user;
        if(user_data.type == "student"){
            return res.status(401).json({message: "Unauthorized access!"});
        }
        else{
            const {studentId, fname, lname, email, phone, year, term, notes, password, confirmPassword, type} = req.body;
            const username = email;
            let { displayName } = req.body;
            let student_params = {studentId, fname, lname, email, phone, year, term, notes};
            let user_params = {username, password, displayName, type};

            if (!displayName) displayName = username;

            if (!displayName || !username || !password || !confirmPassword || !type) {
                return res.status(400)
                    .json({ message: "All fields are mandatory" });
            }

            // if (password.length < 5) {
            //     return res.status(400)
            //         .json({ message: "Password should be least 5 characters" });
            // }

            if (password !== confirmPassword) {
                return res.status(400)
                    .json({ message: "Confirm password does not match with password" });
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Username already exists." });
            }

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            const user = new User({
                username,
                password: passwordHash,
                displayName,
                type
            });
            await user.save();
            const student = new Student(student_params);
            await student.save();
            return res.status(201).json(student);
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const user_data = req.session.user;
        if(user_data.type == "student"){
            return res.status(401).json({message: "Unauthorized access!"});
        }
        else{
            const {id, fname, lname, phone, term, year, notes} = req.body;
            const { body } = req;

            if(!id){
                return res
                    .status(400)
                    .json({ message: "Invalid data provided" });
            }

            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No entry found with id: ${id}` });

            const studentrec = await Student.findByIdAndUpdate(id, body, { new: true });
            // await Student.populate(studentrec, { path: "school" });
            return res.status(200).json(studentrec);
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const user_data = req.session.user;
        if(user_data.type == "student"){
            return res.status(401).json({message: "Unauthorized access!"});
        }
        const { id } = req.body;
        let student_details = await Student.findByIdAndDelete(id);
        let result = await User.deleteOne({"username":student_details.email});
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Successfully deleted!" });
        } else {
            return res.status(404).json({ message: "User not found.." });
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// student register to a hospital
export const registerToHospital = async (req, res) => {
    try {
        const student = await Student.findOne({"email": req.session.user.username});
        const {placement_type, agency_name, notes} = req.body;
        const agency_type = "hospital";
        const agency = await Agency.findOne({"name": agency_name, placement_type, agency_type});
        let placement_list = agency.placements;
        // check for duplicate request
        for(let i=0; i<placement_list.length;i++){
            if(placement_list[i].student.equals(student._id)){
                return res.status(200).json({message: "Already registered!"});
            }
        }
        let {current_capacity} = agency;
        if(current_capacity <= 0){
            return res.status(200).json({message: "Slots full!"});
        }
        agency.current_capacity = current_capacity - 1;
        agency.placements.push({"student": student._id, notes});
        student.placements.push({"agency": agency._id, notes});
        agency.save();
        student.save();
        return res.status(200).json({message: "Registered Successfully!"});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
};

// student register to a community
export const registerToCommunity = async (req, res) => {
    try {
        const student = await Student.findOne({"email": req.session.user.username});
        const {placement_type, agency_name, notes} = req.body;
        const agency_type = "community";
        const agency = await Agency.findOne({"name": agency_name, placement_type, agency_type});
        let {current_capacity} = agency;
        let placement_list = agency.placements;
        // check for duplicate request
        for(let i=0; i<placement_list.length;i++){
            if(placement_list[i].student.equals(student._id)){
                return res.status(200).json({message: "Already registered!"});
            }
        }
        if(current_capacity <= 0){
            return res.status(200).json({message: "Slots full!"});
        }
        agency.current_capacity = current_capacity - 1;
        agency.placements.push({"student": student._id, notes});
        student.placements.push({"agency": agency._id, notes});
        agency.save();
        student.save();
        return res.status(200).json({message: "Registered Successfully!"});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
};

// gives list of placements(hospital and community) of a student
export const studentPlacements = async (req, res) => {
    try {
        const user = req.session.user;
        const {id} = req.body;

        if(user.type == "student"){
            // if request is from student
            const student = await Student.findOne({"email": user.username}, 'studentId')
            .sort({createdAt: -1})
            .populate({path: 'placements.agency', select: ['name','placement_type','agency_type']});
            const total_count = student.placements.length;
            if(total_count==0){
                return res.status(200).json({student, message: "No placements", total_count});
            }
            return res.status(200).json({student, total_count, msg: "list of placements of requested student"});
       }
        if(!id && user.type == "admin"){
            // if request is from admin without student record id return all student placement details
            const student = await Student.find({}, 'studentId fname lname email year term')
            .sort({createdAt: -1})
            .populate({path: 'placements.agency', select: ['name','placement_type','agency_type']});
            return res.status(200).json({student, msg: "list of all student-placement details"});
        }
        // if request is from admin with student record id
        const student = await Student.findById(id, 'studentId')
        .sort({createdAt: -1})
        .populate({path: 'placements.agency', select: ['name','placement_type','agency_type']});
        const total_count = student.placements.length;
        if(total_count==0){
            return res.status(200).json({student,"message": "No placements", total_count});
        }
        return res.status(200).json({student, total_count, msg: "list of placements of requested student"});
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// student request list of all plcement_types from agencies
export const placementTypes = async (req, res) => {
    try{
        const {agency_type} = req.body;
        const placement_types = await Agency.find({agency_type}, 'placement_type').distinct('placement_type');
        return res.status(200).json({placement_types, "msg": "List of placement-types"});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
}

// student request list of agency names and current capacity from agencies based on placement_type and visibility
export const agencyNames = async (req, res) => {
    try{
        const {placement_type, agency_type} = req.body;
        const agency = await Agency.find({agency_type, placement_type, current_capacity: {$gt:0}, visibility: true}, 'name current_capacity');
        let total_count = agency.length;
        if(total_count == 0){
            return res.status(200).json({agency, total_count,"message": "No agencies available"});
        }
        return res.status(200).json({agency, total_count, "msg": "List of agency-names with slots available"});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
}