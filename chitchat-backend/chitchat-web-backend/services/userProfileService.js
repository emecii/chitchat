import { UserModel } from "../models/user-profile.js";

export async function insertUser(user) {
    return await UserModel.create(user);
}
export async function getUserByUserId(user_id) {
    return await UserModel.findOne({user_id: user_id});
}

export async function getUser(user) {
    return await UserModel.findOne(user);
}

export async function deleteUser(user) {
    return await UserModel.findOneAndDelete(user);
};
