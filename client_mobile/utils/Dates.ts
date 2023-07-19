export const isToday = (date:Date) => {
  const today = new Date();

  if (today.getFullYear() === date.getFullYear()
    && today.getMonth() === date.getMonth()
    && today.getDate() === date.getDate()
  ) return true;
  return false;
};
