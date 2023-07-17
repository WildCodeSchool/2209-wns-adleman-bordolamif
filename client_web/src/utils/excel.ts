import { utils, writeFileXLSX } from 'xlsx';
import { removeDetailFromDailyStats, transformDataForExcelDownload, transformGlobalDataToServiceForExcel } from './statistics/statFunctions';
import { TicketData } from './types/DataTypes';
import { DailyStatistics } from './types/StatisticsTypes';

export const exportPeriodTickets = (data: TicketData[]) => {
  const parsedData = transformDataForExcelDownload(data);
  const ws = utils.json_to_sheet(parsedData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data');
  writeFileXLSX(wb, 'ticketStatistics.xlsx');
};

export const exportAnnualStats = (data: DailyStatistics[]) => {
  const parsedData = transformGlobalDataToServiceForExcel(data);
  const wb = utils.book_new();
  const globalStats = removeDetailFromDailyStats(data);
  const gws = utils.json_to_sheet(globalStats);
  utils.book_append_sheet(wb, gws, 'Global');
  for (let i = 0; i < parsedData.length; i += 1) {
    const ws = utils.json_to_sheet(parsedData[i]);
    utils.book_append_sheet(wb, ws, parsedData[i][0].service);
  }
  writeFileXLSX(wb, 'annualStatistics.xlsx');
};
