import { UserModel } from "../models/user-profile.js";
import { UserTagsModel } from "../models/user-tags.js";

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

export async function upsertUserTags(user_id, user_tags, user_mbti_tag) {
    return await UserTagsModel.findOneAndUpdate(
        { user_id }, 
        { $set: { user_tags: user_tags, user_mbti_tag: user_mbti_tag }}, 
        { upsert: true }
    );
}
