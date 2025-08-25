const Role = require('../node_modules/secure-mern/models/Role')
const User = require('../node_modules/secure-mern/models/User')
const crypto = require('crypto')
const sendEmail = require('../node_modules/secure-mern/utils/emailTransporter')
const bcrypt = require('bcrypt')
const Userlogs = require('../models/Userlogs')

const AdminController = {
    getallroles: async (req, res) => {
        try {
            const getroles = await Role.find()

            return res.json({ result: getroles })
        }
        catch (err) {
            console.log(err)
        }
    },

    get_system_users: async (req, res) => {
        try {
            const systemusers = await User.find().populate('role')
            return res.json({ result: systemusers })
        }
        catch (err) {
            console.log(err)
        }
    },

    create_system_user: async (req, res) => {
        try {
            const {
                username,
                email,
                role
            } = req.body

            const checkuser = await User.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            });

            if (checkuser) {
                return res.json({ success: false, message: "User Already in System use anther username or Email address" })
            }

            function generateOTP(length = 8) {
                return crypto
                    .randomBytes(length)
                    .toString('base64')
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .slice(0, length);
            }

            const otp = generateOTP();

            await sendEmail({
                to: email,
                subject: "Your Account is Now Active",
                html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f6fb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="background: linear-gradient(135deg, #6d28d9, #8b5cf6); padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to LawSystem</h1>
                    <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Your account is ready!</p>
                </div>

                <div style="padding: 20px;">
                    <h2 style="color: #333;">Hello ${email},</h2>
                    <p style="color: #555; font-size: 15px;">
                        We are excited to let you know that your account has been successfully created on <strong>LawSystem</strong>.
                    </p>

                    <p style="color: #555; font-size: 15px;">
                        Please use the credentials below to log in:
                    </p>

                    <div style="background-color: #f4f3ff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-top: 10px; font-family: monospace; font-size: 14px;">
                        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 0;"><strong>Password:</strong> ${otp}</p>
                    </div>

                    <p style="color: #b91c1c; font-size: 14px; margin-top: 15px;">
                        <strong>IMPORTANT:</strong> Please change your password immediately after your first login.
                    </p>

                    <p style="color: #888; font-size: 13px; margin-top: 15px;">
                        This password is valid for the next 10 minutes. Do not share it with anyone.
                    </p>

                    <p style="margin-top: 20px; font-size: 15px; color: #333;">
                        Best regards,<br>
                        <strong>LawSystem Team</strong>
                    </p>
                </div>
            </div>

            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 15px;">
                © ${new Date().getFullYear()} LawSystem. All rights reserved.
            </p>
        </div>
    `,
            });

            const hashgenaretedpassword = await bcrypt.hash(otp, 10)

            const createuser = new User({
                username: username,
                email: email,
                role: role,
                password: hashgenaretedpassword,
                isEmailVerified: true,
                isActive: true
            })

            const resultcreatenewuser = await createuser.save()

            if (resultcreatenewuser) {
                return res.json({ success: true, message: "User Account has been Created Success" })
            }
            else {
                return res.json({ success: false, message: "Internal Sever Error while creating New user" })
            }

        }
        catch (err) {
            console.log(err)
        }
    },

    createPermission: async (req, res) => {
        try {
            const { role, permission } = req.body;
            const permissionsArray = Array.isArray(permission) ? permission : [permission];

            const permissionCreate = await Role.findOneAndUpdate(
                { _id: role },
                { $addToSet: { permissions: { $each: permissionsArray } } }, // Add, no duplicates
                { new: true, runValidators: true }
            );

            if (permissionCreate) {
                return res.json({ success: true, message: "Permission(s) Added Successfully" });
            } else {
                return res.status(404).json({ success: false, message: "Role not found" });
            }
        } catch (err) {
            console.error("Error adding permission:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
        }
    },

    get_role_data: async (req, res) => {
        try {
            const role_id = req.params.id
            const get_role = await Role.findById(role_id)
            return res.json({ result: get_role })
        }
        catch (err) {
            console.log(err)
        }
    },

    delete_premission: async (req, res) => {
        try {
            const role_id = req.params.id
            const {
                permission
            } = req.body

            const updatedRole = await Role.findByIdAndUpdate(
                role_id,
                { $pull: { permissions: permission } },
                { new: true }
            );

            if (updatedRole) {
                return res.json({ success: true, message: "Permission Deleted Success" })
            }
            else {
                return res.json({ success: false, message: "Internal Server Error" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    create_new_role: async (req, res) => {
        try {
            const { role } = req.body

            const checkrole = await Role.findOne({ name: role })

            if (checkrole) {
                return res.json({ success: false, message: "Cannot use this role to create new role, role already in System" })
            }

            const newrole = new Role({
                name: role
            })

            const resultnewrole = await newrole.save()

            if (resultnewrole) {
                return res.json({ success: true, message: "Role Created Success" })
            }
            else {
                return res.json({ success: false, message: "Internal Server Error" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },


    delete_role: async (req, res) => {
        try {
            const role_id = req.params.id

            const checkroleid = await Role.findById(role_id)

            const protectedRoles = ['admin', 'judge', 'lawyer', 'member'];
            if (protectedRoles.includes(checkroleid.name)) {
                return res.json({ success: false, message: "Cannot continue process" });
            }

            const deleterole = await Role.findByIdAndDelete(role_id)

            if (deleterole) {
                return res.json({ success: true, message: "Role Deleted Success" })
            }
            else {
                return res.json({ success: false, message: "Internal Server Error" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    update_user_status: async (req, res) => {
        try {
            const user_id = req.params.id

            const checkuser = await User.findById(user_id)

            const newStatus = !checkuser.isActive;
            checkuser.isActive = newStatus;
            await checkuser.save();

            return res.json({ 
                success: true, 
                message: `User status updated to ${newStatus ? "Active" : "Inactive"}`,
            });
        }
        catch (err) {
            console.log(err)
        }
    },

    get_user_activities: async(req, res) => {
        try{
            const useractivities = await Userlogs.find().populate('user')

            return res.json({ success: true, result: useractivities })
        }
        catch(err){
            console.log(err)
        }
    },

    get_one_activity: async(req, res) => {
        try{
            const log_id = req.params.id

            const getactivity = await Userlogs.findById(log_id).populate('user')

            return res.json({ success: true, result: getactivity })
        }
        catch(err){
            console.log(err)
        }
    }

};

module.exports = AdminController;

