import { Between } from 'typeorm';
import { DateFilterEnum } from '../enums/DateFilterEnum';
import { SearchFilter } from '../interfaces';

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

export const dateFilterBuilder = (filter?: string): SearchFilter | undefined => {
  const searchFilter: SearchFilter = {};

  switch (filter) {
    case DateFilterEnum.TODAY:
      searchFilter.where = { createdAt: Between(startOfDay, endOfDay) };
      break;
    case DateFilterEnum.THIS_WEEK:
      searchFilter.where = { createdAt: Between(startOfWeek, endOfWeek) };
      break;
    case DateFilterEnum.THIS_MONTH:
      searchFilter.where = { createdAt: Between(startOfMonth, endOfMonth) };
      break;
    case DateFilterEnum.THIS_YEAR:
      searchFilter.where = { createdAt: Between(startOfYear, endOfYear) };
      break;
    default:
      searchFilter.where = undefined;
      break;
  }
  return searchFilter;
};
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
