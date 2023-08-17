import { Schema, model } from "mongoose";

const userSchema = new Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        hashPass: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: true
    });
    
    export const User = model('User', userSchema);    