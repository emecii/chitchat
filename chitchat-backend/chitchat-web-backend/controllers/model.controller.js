import {
  getModelByModelId,
  insertModel,
  updateModel,
  updateModelVotes,
  getModelsByFilters,
  getSelectedModels,
} from "../services/modelProfileService.js";

import { getConvsByUser } from "../services/conversationService.js";
import { createInitPrompt } from "../util.js";

export const getModelProfile = async (req, res) => {
  const { user_id, gender, is_public, model_id, is_selected } = req.query;
  try {
    const filters = {};
    if (user_id) filters.user_id = user_id;
    if (gender) filters.gender = gender;
    if (is_selected !== undefined) filters.is_selected = is_selected === "true";
    if (is_public !== undefined) filters.is_public = is_public === "true";
    console.log("model_id", model_id);
    if (model_id) filters.model_id = model_id;
    console.log(JSON.stringify(filters));
    var models;
    if (is_selected === "true") {
      models = await getSelectedModels(filters);
    } else {
      models = await getModelsByFilters(filters);
    }
    res.json({ data: models, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postModelProfile = async (req, res) => {
  const model_id = req.body.model_id;
  const user_id = req.body.user_id;
  const model_name = req.body.model_name;
  const model_type = req.body.model_type;
  var model_metadata = req.body.model_metadata;
  const init_prompt = createInitPrompt(model_metadata);
  model_metadata["user_id"] = user_id;
  model_metadata["initial_prompt"] = init_prompt;
  model_metadata["upVote"] = 1;
  model_metadata["downVote"] = 0;
  const model = {
    model_id: model_id,
    model_name: model_name,
    model_type: model_type,
    model_metadata: model_metadata,
  };
  var existing_model = await getModelByModelId(model_id);
  if (existing_model) {
    res.status(409).json({ error: "Model already existed!" });
    return;
  }
  try {
    await insertModel(model);
    res.json({ message: `model ${model_name} added!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateModelProfile = async (req, res) => {
  const model_id = req.body.model_id;
  const user_id = req.body.user_id;
  const model_name = req.body.model_name;
  const model_type = req.body.model_type;
  var model_metadata = req.body.model_metadata;

  if (!model_id) {
    res.status(400).json({ error: "Model ID is required!" });
    return;
  }

  const existing_model = await getModelByModelId(model_id);

  if (!existing_model) {
    res.status(404).json({ error: "Model not found!" });
    return;
  }

  const updatedModel = {
    model_id: model_id,
    user_id: user_id || existing_model.user_id,
    model_name: model_name || existing_model.model_name,
    model_type: model_type || existing_model.model_type,
    model_metadata: model_metadata || existing_model.model_metadata,
  };

  try {
    await updateModel(model_id, updatedModel);
    res.json({ message: `Model ${model_name} updated!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVotes = async (req, res) => {
  const model_id = req.body.model_id;
  const upVote = req.body.upVote;
  const downVote = req.body.downVote;

  if (!model_id) {
    res.status(400).json({ error: "Model ID is required!" });
    return;
  }

  const existing_model = await getModelByModelId(model_id);

  if (!existing_model) {
    res.status(404).json({ error: "Model not found!" });
    return;
  }

  try {
    await updateModelVotes(model_id, upVote, downVote);
    res.json({
      message: `Model ${model_id} votes updated!`,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChatModels = async (req, res) => {
  try {
    var model_ids = [];
    const user_id = req.query.user_id;
    console.log("user_id is " + user_id);
    if (user_id != undefined && user_id != "unknown") {
      const convs = await getConvsByUser(user_id);
      model_ids = convs.map((conv) => conv.model_id);
    }
    res.json({ data: model_ids, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
