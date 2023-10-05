import mongoose from "mongoose";
import Student from "../models/students.js";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getStudents = async (req, res) => {
    try {
        const user_data = await User.findById(req.user);
        if(!user_data){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        if(user_data.type == "student"){
            res.status(401).json({message: "Unauthorized access!"});
        }
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

        res.status(200).json({
            data: Studentrec,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
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
            .populate("clinicalPlanHistory")
            // .populate("placementLocationsHistory")
            // .populate({
            //     path: "placementLocationsHistory",
            //     populate: [{ path: "hospital" }, { path: "instructor" }]
            // })
            // .populate("placementsHistory");
        // .populate("school");

        res.status(200).json(Studentrec);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getStudentPlacements = async (req, res) => {
    try {
        const { id } = req.params;

        const Studentrec = await Student.findById(id)
            .populate("placementLocationsHistory")
            .populate("placementsHistory");

        res.status(200).json(Studentrec);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addStudent = async (req, res) => {
    try {
        const user_data = await User.findById(req.user);
        if(!user_data){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        if(user_data.type == "student"){
            res.status(401).json({message: "Unauthorized access!"});
        }
        const {studentId, fname, lname, email, phone, year, term, notes, username, password, confirmPassword, type} = req.body;
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
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// export const importStudents = async (req, res) => {
//     try {
//         const failed = [];
//         await Promise.all((req.body || []).map(async (student) => {
//             try {
//                 const studentModel = await Student.findOne({ studentId: student.studentId });

//                 if (studentModel) {
//                     throw new Error("Student ID already exists");
//                 } else {
//                     await Student.create(student);
//                 }
//             } catch (err) {
//                 failed.push({
//                     data: student,
//                     err: err.message
//                 });
//                 return null;
//             }
//         }));
//         res.json({ message: " Imported successfully.", failed });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

export const updateStudent = async (req, res) => {
    try {
        const user_data = await User.findById(req.user);
        if(!user_data){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        if(user_data.type == "student"){
            res.status(401).json({message: "Unauthorized access!"});
        }
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
        res.status(200).json(studentrec);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const user_data = await User.findById(req.user);
        if(!user_data){
            return res
                .status(400)
                .json({ message: "Invalid token." });
        }
        if(user_data.type == "student"){
            res.status(401).json({message: "Unauthorized access!"});
        }
        const { id } = req.body;
        student = await Student.findByIdAndDelete(id);
        if(!student){
            return res
                .status(400)
                .json({ message: "Student does not exist." });
        }
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// export const deleteStudents = async (req, res) => {
//     const { body } = req;
//     try {
//         await Student.deleteMany({ _id: { $in: body } });
//         res.json({ message: "Student record deleted successfully." });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };
