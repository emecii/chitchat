import { object, string, date, ValidationError } from 'yup';
import GenderType from '../types/GenderType';

interface UserProfile {
    user_id: string;
    user_name: string;
    gender: GenderType;
    birthday: Date | string; // string in case the date is not yet a Date object
    // city: string;
    phone: string;
    profile_url: string;
}

// TODO: Add more validation if needed
const userProfileSchema = object().shape({
    // User id validation will be done in backend
    // user_id: string().required('User ID is required'),
    user_name: string().required('昵称必须填写哦'),
    gender: string().oneOf(Object.values(GenderType)).required('性别必须填写哦'),
    birthday: date().required('生日必须填写哦'),
    // city: string().required('City is required'),
    phone: string().required('手机号必须填写哦，用于接收验证码。'),
    profile_url: string().url('Invalid URL').required('头像必须选择哦'),
});

export const validateUserProfile = async (data: UserProfile): Promise<{[key: string]: string} | {}> => {
  let errors: { [key: string]: string } = {};
  const paths = Object.keys(userProfileSchema.fields);

  for (const path of paths) {
    try {
      await userProfileSchema.validateAt(path, data);
    } catch (error) {
      if (error instanceof ValidationError && typeof error.path === 'string') {
        errors = {
          ...errors,
          [error.path]: error.message,
        };
      } else {
        throw error; // If it's not a validation error, re-throw it
      }
    }
  }

  return errors;
};
