export interface StatisticsDetail {
      service: string;
      number: number;
      mobileRate: number;
      waitingTimeAverage: number;
      returnedRate: number;
      firstTimeRate: number;
}

export interface DailyStatistics {
  date: string;
  total: number;
  detail: StatisticsDetail[];
}

export interface TooltipValues {
  date: string;
  count: number;
  detail: StatisticsDetail[];
}

export interface DailyHeatmapStat {
  date: string;
  count: number
}
