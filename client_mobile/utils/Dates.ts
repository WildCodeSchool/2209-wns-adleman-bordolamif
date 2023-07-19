export const isToday = (stringDate:string) => {
  const today = new Date();
  const date = new Date(stringDate);

  if (today.getFullYear() === date.getFullYear()
    && today.getMonth() === date.getMonth()
    && today.getDate() === date.getDate()
  ) return true;
  return false;
};
