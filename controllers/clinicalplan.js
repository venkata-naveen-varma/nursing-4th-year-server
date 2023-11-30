import mongoose from 'mongoose';
import ClinicalPlan from '../models/clinical_plan.js'
import Student from '../models/students.js';
import User from '../models/users.js';
import SemesterOptions from '../models/clinical_plan_semesterOptions.js'
import ToggleClinicalPlanRegister from "../models/toggleClinicalPlanRegistration.js";

// student request for their specific plan, admin request all plans
export const getClinicalPlans = async (req, res) => {
    try {
        const user = req.session.user;
        // student requesting the clinical plan details
        if(user.type == "student"){
            const student_details = await Student.findOne({"email":user.username});
            let studentId = student_details.studentId;

            const clinical_plans = await ClinicalPlan.find({studentId}).sort({ createdAt: -1 });

            const totalCount = await ClinicalPlan.find({}).count();

            return res.status(200).json({
                data: clinical_plans,
                totalCount
            });
        }
        // list of all clinical plans for admin view
        const clinical_plans = await ClinicalPlan.find({})
        .sort({createdAt: -1});
        // .populate("student_object");

        const totalCount = clinical_plans.length;

        return res.status(200).json({
            data: clinical_plans,
            totalCount
        });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// request the options for semester sequence and the seats available
export const getSemOptions = async (req, res) => {
    try {
        // list of options
        const semesterOptions = await SemesterOptions.find({})
        .sort({createdAt: -1});
        
        const totalCount = semesterOptions.length;
        return res.status(200).json({
            data: semesterOptions,
            totalCount
        });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// Admin will add the options, seats for semester sequence in clinical plan page
export const setSemOptions = async (req, res) => {
    try {
        const user = req.session.user;
        if(user.type == "student"){
            return res.status(400).json({message: "Only Admins can edit a Clinical Plan."});
        }

        // reset the available seats for each semester option
        if(req.body.reset_seats_filled === true){
            const semesterOption = await SemesterOptions.updateMany({}, {"seats_filled": 0}, {returnOriginal: false});
            const all_options = await SemesterOptions.find({});
            return res.status(200).json({data: all_options, message: "Seats availability reset successfull."});
        }

        const options = Object.keys(req.body);
        
        for(let i in options){
            const semesterOption = await SemesterOptions.findOne({"field": options[i]});
            let seats = req.body[options[i]];
            if(!semesterOption){
                const new_option = new SemesterOptions({"field": options[i], "seats": seats});
                await new_option.save();
            }else{
                semesterOption.seats = seats;
                await semesterOption.save();
            }
        }
        const all_options = await SemesterOptions.find({});
        return res.status(200).json({data: all_options, message: "Semester Options updated successfully."});
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// delete all the options for semester sequence
export const delSemOptions = async (req, res) => {
    try {
        const user = req.session.user;
        if(user.type == "student"){
            return res.status(400).json({message: "Only Admins can edit a Clinical Plan."});
        }
        await SemesterOptions.deleteMany({});
        return res.status(200).json({message: "Semester Options deleted successfully."});
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


export const addClinicalPlan = async (req, res) => {
    try {
        // check if registration for clinicalPlan is open or not
        const toggleObj = await ToggleClinicalPlanRegister.findOne({});
        if(toggleObj.registration_open === false){
            return res.status(400).json({"message": "ClinicalPlan registration not open yet"});
        }
        const user = req.session.user;
        if(user.type != "student"){
            return res.status(400).json({message: "Only Students can register for a Clinical Plan!"});
        }
        else{
            // fetching studentId
            const student_details = await Student.findOne({"email":user.username});
            let studentId = student_details.studentId;
            // Clinical Plan exists or not?
            const existingPlan = await ClinicalPlan.findOne({studentId});
            if (existingPlan) {
                return res
                    .status(400)
                    .json({ message: "Clinical Plan already submitted!" });
            }
            req.body.studentId = studentId;
            req.body.student_object = student_details._id;
            const semesterOptions = await SemesterOptions.find({"semester_sequence": req.body.semester_sequence});
            semesterOptions.seats_filled = semesterOptions.seats_filled+1;
            const clinical_plan = new ClinicalPlan(req.body);
            await clinical_plan.save();
            return res.status(200).json(clinical_plan);
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// ON/OFF Clinical Plan registration
export const toggleClinicalPlanRegistration = async (req, res) => {
    try{
        const user = req.session.user;
        const {registration_open} = req.body;
        req.body.updated_by = user._id;
        if(registration_open && (!(typeof(registration_open) == "boolean"))){
            return res.status(400).json({"message": "Invalid data provided"});
        }
        const toggleObj = await ToggleClinicalPlanRegister.findOneAndUpdate({}, req.body, {returnOriginal: false});
        if(!toggleObj){
            return res.status(400).json({message: "Update Unsuccessfull"});
        }
        return res.status(200).json({data: toggleObj, message: "Updated Successfully"});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
};

// get details of clinical plan toggle
export const clinicalPlanToggleDetails = async (req, res) => {
    try{
        const toggleDetails = await ToggleClinicalPlanRegister.findOne({});
        return res.status(200).json({data: toggleDetails});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
};
