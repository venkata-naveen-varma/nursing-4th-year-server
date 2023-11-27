import mongoose from 'mongoose';
import ClinicalPlan from '../models/clinical_plan.js'
import Student from '../models/students.js';
import User from '../models/users.js';
import SemesterOptions from '../models/clinical_plan_semesterOptions.js'

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
        await SemesterOptions.remove({});
        return res.status(200).json({message: "Semester Options deleted successfully."});
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


export const addClinicalPlan = async (req, res) => {
    try {
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
            const clinical_plan = new ClinicalPlan(req.body);
            await clinical_plan.save();
            return res.status(200).json(clinical_plan);
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
