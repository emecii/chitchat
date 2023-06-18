import mongoose, { Schema } from "mongoose";
 
const modelProfileSchema = new Schema({
  model_id: String,
  model_name: String,
  model_metadata: Object,
  model_type: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
 
export const AImodelModel = mongoose.model("ModelProfile", modelProfileSchema);