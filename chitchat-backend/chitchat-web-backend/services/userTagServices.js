
import { UserTagsModel } from "../models/user-tags.js";

export async function upsertUserTags(user_id, user_tags, user_mbti_tag) {
    return await UserTagsModel.findOneAndUpdate(
        { user_id }, 
        { $set: { user_tags: user_tags, user_mbti_tag: user_mbti_tag }}, 
        { upsert: true }
    );
}

export async function findById(user_id) {
    return await UserTagsModel.findOne({user_id: user_id});
}
