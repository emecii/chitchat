import { User } from "../models/user.model.js";

export async function insertUser(user) {
    return await User.create(user);
}
export async function findById(user_id) {
    return await User.findOne({user_id: user_id});
}

export async function findByPhone(phone) {
    return await User.findOne({phone: phone});
}

export async function deleteUser(user) {
    return await User.findOneAndDelete(user);
};
