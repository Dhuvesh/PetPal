import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Common fields
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    userType: {
        type: String,
        enum: ['user', 'ngo'],
        required: true,
        default: 'user'
    },
    profilePic: {
        type: String,
        default: "",
    },
    
    // Individual user fields
    fullName: {
        type: String,
        required: function() {
            return this.userType === 'user';
        }
    },
    
    // NGO representative fields
    ngoName: {
        type: String,
        required: function() {
            return this.userType === 'ngo';
        }
    },
    personName: {
        type: String,
        required: function() {
            return this.userType === 'ngo';
        }
    },
    phoneNumber: {
        type: String,
        required: function() {
            return this.userType === 'ngo';
        }
    },
    idCardPhoto: {
        type: String,
        required: function() {
            return this.userType === 'ngo';
        }
    },
    
    // NGO verification status
    isVerified: {
        type: Boolean,
        default: function() {
            return this.userType === 'user' ? true : false;
        }
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() {
            return this.userType === 'ngo' ? 'pending' : 'approved';
        }
    }
}, 
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;