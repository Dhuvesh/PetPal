import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

// Individual User Signup
export const signup = async (req, res) => {
    const { fullName, email, password, userType = 'user' } = req.body;
    
    try { 
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"            
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
            userType: 'user'
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                userType: newUser.userType,
                isVerified: newUser.isVerified
            });
        } else {
            return res.status(400).json({
                message: "Invalid user data"
            });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({
            message: "Server error"
        }); 
    }
};

// NGO Representative Signup
export const ngoSignup = async (req, res) => {
    const { ngoName, personName, phoneNumber, email, password, idCardPhoto } = req.body;
    
    try {
        // Validation
        if (!ngoName || !personName || !phoneNumber || !email || !password || !idCardPhoto) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"            
            });
        }

        // Phone number validation (basic)
        if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phoneNumber)) {
            return res.status(400).json({
                message: "Invalid phone number format"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Upload ID card photo to cloudinary
        let idCardPhotoUrl = "";
        if (idCardPhoto) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(idCardPhoto, {
                    folder: "ngo_id_cards",
                    resource_type: "image"
                });
                idCardPhotoUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.log("Error uploading ID card:", uploadError);
                return res.status(400).json({
                    message: "Error uploading ID card photo"
                });
            }
        }

        const newNGOUser = new User({
            ngoName,
            personName,
            phoneNumber,
            email,
            password: hashPassword,
            userType: 'ngo',
            idCardPhoto: idCardPhotoUrl,
            isVerified: false,
            verificationStatus: 'pending'
        });

        if (newNGOUser) {
            generateToken(newNGOUser._id, res);
            await newNGOUser.save();

            res.status(201).json({
                _id: newNGOUser._id,
                ngoName: newNGOUser.ngoName,
                personName: newNGOUser.personName,
                phoneNumber: newNGOUser.phoneNumber,
                email: newNGOUser.email,
                profilePic: newNGOUser.profilePic,
                userType: newNGOUser.userType,
                isVerified: newNGOUser.isVerified,
                verificationStatus: newNGOUser.verificationStatus
            });
        } else {
            return res.status(400).json({
                message: "Invalid NGO data"
            });
        }
    } catch (error) {
        console.log("Error in NGO signup controller:", error.message);
        res.status(500).json({
            message: "Server error"
        }); 
    }
};

// Universal Login (works for both user types)
export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        generateToken(user._id, res);
        
        // Return different data based on user type
        if (user.userType === 'user') {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                userType: user.userType,
                isVerified: user.isVerified
            });
        } else if (user.userType === 'ngo') {
            res.status(200).json({
                _id: user._id,
                ngoName: user.ngoName,
                personName: user.personName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                profilePic: user.profilePic,
                userType: user.userType,
                isVerified: user.isVerified,
                verificationStatus: user.verificationStatus
            });
        }
    } catch (error) {
        console.log("Error in Login controller:", error.message);
        res.status(500).json({
            message: "Internal Server error"
        });
    }
};

export const logout = (req, res) => {    
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({
            message: "Internal Server error"
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({
                message: "Profile pic is required"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploadResponse.secure_url }, 
            { new: true }
        );
        
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({
            message: "Internal Server error"
        });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({
            message: "Internal Server error"
        });
    } 
};