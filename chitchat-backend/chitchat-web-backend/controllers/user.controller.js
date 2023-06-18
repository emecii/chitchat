import { getUser, getUserByUserId, insertUser } from "../services/userProfileService.js";

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
  const user = {
    user_id: user_id,
    user_name: user_name,
    gender: gender,
    birthday: birthday,
    city: city,
    phone: phone
  };
  var existing_user = await getUser({phone: phone});
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
