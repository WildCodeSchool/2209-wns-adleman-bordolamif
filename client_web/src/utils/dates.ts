export const today = new Date();

export const getYesterday = ():Date => {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
};

export const getOneYearAgo = () => {
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  return oneYearAgo;
};
