import GenderType from '../types/GenderType';

export const genderToRequiredGender: Record<GenderType, string> = {
  [GenderType.MALE]: 'W',
  [GenderType.OTHER]: 'O',
  [GenderType.FEMALE]: 'M',
  [GenderType.UNKNOWN]: '',
};
