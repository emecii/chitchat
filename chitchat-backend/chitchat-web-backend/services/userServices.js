import { UserModel } from "../models/user.js";

export async function insertUser(user) {
    return await UserModel.create(user);
}

export async function updateUser(user) {
    return await UserModel.findOneAndUpdate({ id: user.user_id }, { $set: user });
}

export async function findById(user_id) {
    return await UserModel.findOne({id: user_id});
}

export async function findByPhone(phone) {
    return await UserModel.findOne({phone: phone});
}
