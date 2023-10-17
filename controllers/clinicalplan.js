import mongoose from 'mongoose';
import ClinicalPlan from '../models/clinical_plan.js'
import Student from '../models/students.js';
import User from '../models/users.js';

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

            res.status(200).json({
                data: clinical_plans,
                totalCount
            });
        }
        // list of all clinical plans for admin view
        const clinical_plans = await ClinicalPlan.find({})
        .sort({createdAt: -1});
        // .populate("student_object");

        const totalCount = clinical_plans.length;

        res.status(200).json({
            data: clinical_plans,
            totalCount
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
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
