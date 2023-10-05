import mongoose from 'mongoose';
import ClinicalPlan from '../models/clinical_plan.js'

export const getClinicalPlans = async (req, res) => {
    try {
        const { index, limit } = req.query;

        const clinical_plans = await ClinicalPlan.find({})
            .sort({ createdAt: -1 });
            // .limit(limit)
            // .skip(index);

        const totalCount = await ClinicalPlan.find({}).count();

        res.status(200).json({
            data: clinical_plans,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};