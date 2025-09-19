// that mean of schema

import mongoose from "mongoose";

const userSchema=mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        default: []
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        default: []
    }],

},{timestamps:true});

const  User=mongoose.model("User",userSchema);

export default User;

