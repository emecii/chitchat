
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    role :{
     type : String,
     enum:["ADMIN","USER"],
     default:"USER",
    },


   phoneOtp:String


  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);