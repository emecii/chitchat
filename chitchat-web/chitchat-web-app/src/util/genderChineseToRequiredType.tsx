export const genderChineseToRequiredType = (gender: string): string => {
  const map: Record<string, string> = {
    女: 'W',
    男: 'M',
  };

  return map[gender] || 'O';
};
