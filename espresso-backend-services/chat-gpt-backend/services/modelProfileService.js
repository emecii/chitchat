import { AImodelModel } from "../models/model-profile.js";

export async function insertModel(model) {
    return await AImodelModel.create(model);
}
export async function getModelByModelId(model_id) {
    return await AImodelModel.findOne({model_id: model_id});
}

export async function deleteModel(model) {
    return await AImodelModel.findOneAndDelete(model);
};

export async function updateModel(model_id, updatedModel) {
    return await AImodelModel.updateOne({ model_id: model_id }, updatedModel);
};

export async function updateModelVotes(model_id, upVote, downVote) {
    const update = {};
    if (upVote) {
      update['model_metadata.upVote'] = upVote;
    }
    if (downVote) {
      update['model_metadata.downVote'] = downVote;
    }
  
    return await AImodelModel.updateOne({ model_id: model_id }, { $inc: update });
  }
  
export async function getModelsByFilters(filters) {
    const query = {};

    if (filters.user_id) {
      query["user_id"] = filters.user_id;
    }
  
    if (filters.gender) {
      if (filters.gender === "O") {
        // Do nothing, all models will be returned
      } else {
        query["model_type"] = filters.gender;
      }
    }
  
    if (filters.is_public !== undefined) {
      query["model_metadata.is_public"] = filters.is_public;
    }
    return await AImodelModel.find(query);
}
