export const today = new Date();

export const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
export const endOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  23,
  59,
  59,
);

export const startOfWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - today.getDay(),
);
export const endOfWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - today.getDay() + 6,
  23,
  59,
  59,
);

export const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
export const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

export const startOfYear = new Date(today.getFullYear(), 0, 1);
export const endOfYear = new Date(today.getFullYear(), 12, 0, 23, 59, 59);
