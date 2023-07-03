import { getUser, getUserByUserId, insertUser, updateUser, upsertUserTags } from "../services/userProfileService.js";

export const getUserProfile = async (req, res) => {
  const user_id = req.params.user_id;
  var user = await getUserByUserId(user_id);
  if (user) {
    res.json({
      message: `user ${user.user_name} found!`,
      data: user,
      status: "success",
    });
  } else {
    res.status(404).json({ error: "User not found!" });
  }
};

export const postUserProfile = async (req, res) => {
  const user_id = req.body.user_id;
  const user_name = req.body.user_name;
  const gender = req.body.gender;
  const birthday = req.body.birthday;
  const city = req.body.birthday;
  const phone = req.body.phone;
  const profile_url = req.body.profile_url;
  const user = {
    user_id: user_id,
    user_name: user_name,
    gender: gender,
    birthday: birthday,
    city: city,
    phone: phone,
    profile_url: profile_url,
  };
  // TODO: from pk no phone number, get user will always return a user who has no phone number
  // We should either ask for phone number on pk or use other fields as DB key
  const key = phone ? {phone:phone} : {user_id:user_id};
  var existing_user = await getUser(key);
  if (existing_user) {
    res.status(409).json({ error: "User already existed!" });
    return;
  }
  try {
    await insertUser(user);
    res.json({ message: `user ${user_name} added!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const user_id = req.body.user_id;
  const user_name = req.body.user_name;
  const gender = req.body.gender;
  const birthday = req.body.birthday;
  const city = req.body.birthday;
  const phone = req.body.phone;
  const profile_url = req.body.profile_url;
  const user = {
    user_id: user_id,
    user_name: user_name,
    gender: gender,
    birthday: birthday,
    city: city,
    phone: phone,
    profile_url: profile_url,
  };
  // TODO: from pk no phone number, get user will always return a user who has no phone number
  // We should either ask for phone number on pk or use other fields as DB key
  const key = phone ? {phone:phone} : {user_id:user_id};
  var existing_user = await getUser(key);
  if (!existing_user) {
    res.status(400).json({ error: "User does not exist!" });
    return;
  }
  try {
    await updateUser(user);
    res.json({ message: `user ${user_name} updated!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postUserTags = async (req, res) => {
  const user_tags = req.body.user_tags;
  const user_mbti_tag = req.body.user_mbti_tag;
  const user_id = req.body.user_id;

  try {
    await upsertUserTags(user_id, user_tags, user_mbti_tag);
    res.json({ message: `user ${user_id} tags upserted!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
