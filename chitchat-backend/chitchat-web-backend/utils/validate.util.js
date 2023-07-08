import { object, string, date } from 'yup';

// TODO: Add more validation if needed
const userProfileSchema = object().shape({
    user_id: string().required('User ID is required'),
    user_name: string().required('User name is required'),
    // TODO: check if the gender enum is correct
    gender: string().oneOf(['M', 'F', 'O']).required('Gender is required'),
    birthday: date().required('Birthday is required'),
    // city: string().required('City is required'),
    phone: string().required('Phone number is required'),
    profile_url: string().url('Invalid URL').required('Profile URL is required'),
  });

export const validateUserProfile = async (data) => {
  try {
    await userProfileSchema.validate(data);
    return {};
  } catch (error) {
    return { [error.path]: error.message };
  }
};
