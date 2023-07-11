import { findById, findByPhone, insertUser, updateUser} from "../services/userServices.js";
import { upsertUserTags as mongoUpsertUserTags } from "../services/userTagServices.js"
import { validateUserProfile } from "../utils/validate.util.js";

export const getUserProfile = async (req, res) => {
  const user_id = req.params.user_id;
  var user = await findById(user_id);
  if (user) {
    res.json({
      message: `user ${user.username} found!`,
      data: user,
      status: "success",
    });
  } else {
    res.status(404).json({ error: "User not found!" });
  }
};

export const createUserProfile = async (req, res) => {
  const id = req.body.user_id;
  const username = req.body.user_name;
  const gender = req.body.gender;
  const birthday = req.body.birthday;
  const city = req.body.city;
  const phone = req.body.phone;
  const profileUrl = req.body.profile_url;
  const user = {
    id,
    username,
    gender,
    birthday,
    city,
    phone,
    profileUrl,
  };
  const validationErrors = await validateUserProfile(user);
  console.log(validationErrors);
  if (Object.keys(validationErrors).length > 0) {
    res.status(400).json(validationErrors);
    return;
  }
  // TODO: remove the following code since phone number and id is required
  // TODO: from pk no phone number, get user will always return a user who has no phone number
  // We should either ask for phone number on pk or use other fields as DB key
  var existing_user = phone ? await findByPhone(phone) : await findById(user_id);
  if (existing_user) {
    res.status(409).json({ error: "User already existed!" });
    return;
  }
  try {
    await insertUser(user);
    res.json({ message: `user ${username} added!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const id = req.body.user_id;
  const username = req.body.user_name;
  const gender = req.body.gender;
  const birthday = req.body.birthday;
  const city = req.body.city;
  const phone = req.body.phone;
  const profileUrl = req.body.profile_url;
  const user = {
    id,
    username,
    gender,
    birthday,
    city,
    phone,
    profileUrl,
  };
  // TODO: from pk no phone number, get user will always return a user who has no phone number
  // We should either ask for phone number on pk or use other fields as DB key
  var existing_user = phone ? await findByPhone(phone) : await findById(user_id);
  if (!existing_user) {
    res.status(400).json({ error: "User does not exist!" });
    return;
  }
  try {
    await updateUser(user);
    res.json({ message: `user ${username} updated!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const upsertUserTags = async (req, res) => {
  const user_id = req.body.user_id;
  const user_tags = req.body.user_tags;
  const user_mbti_tag = req.body.user_mbti_tag;

  try {
    await mongoUpsertUserTags(user_id, user_tags, user_mbti_tag);
    res.json({ message: `user ${user_id} tags upserted!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
