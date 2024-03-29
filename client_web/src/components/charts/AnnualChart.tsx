import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { getOneYearAgo, getYesterday } from '@utils/dates';
import {
  DailyHeatmapStat, DailyStatistics, StatisticsDetail, TooltipValues,
} from '@utils/types/StatisticsTypes';
import { MouseEventHandler, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

interface Props {
  annualStatistics: DailyStatistics[]
}

function AnnualChart(props: Props) {
  const { annualStatistics } = props;
  const [tooltipContent, setTooltipContent] = useState<TooltipValues | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getCalendarCountColor = (day: DailyHeatmapStat) => {
    if (day === null || !day) {
      return 'color-0';
    }
    if (day.count < 6) {
      return 'color-1';
    }
    if (day.count < 7) {
      return 'color-2';
    }
    if (day.count < 10) {
      return 'color-3';
    }
    return 'color-4';
  };

  const handleMouseMove:MouseEventHandler<HTMLDivElement> = (event) => {
    const x = event.clientX + 4;
    const y = event.clientY - 10;
    setTooltipPosition({ x, y });
  };

  return (
    <div className="z-50">
      <h2 className="ml-8 mb-4 mt-6 text-2xl ">Récapitulatif annuel</h2>
      <div
        className="max-w-4xl mx-auto w-screen z-50"
        onMouseMove={handleMouseMove}
      >
        <CalendarHeatmap
          startDate={getOneYearAgo()}
          endDate={getYesterday()}
          values={
          annualStatistics!.map(
            (day: DailyStatistics) => (
              { date: day.date, count: day.total, detail: day.detail }),
          )
      }
          classForValue={getCalendarCountColor}
          showWeekdayLabels
          tooltipDataAttrs={(value:TooltipValues) => (value.date && {
            'data-tip': JSON.stringify(value),
          })}
          onMouseOver={(event) => {
            const dataTipValue = event.target.getAttribute('data-tip');
            if (dataTipValue) {
              const parsedDataTip = JSON.parse(dataTipValue);
              setTooltipContent(parsedDataTip);
            } else {
              setTooltipContent(null);
            }
          }}
          onMouseLeave={() => setTooltipContent(null)}
        />
      </div>
      {tooltipContent!
    && (
    <div
      className="absolute flex flex-row items-start z-50"
      style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
    >
      <ChevronLeftIcon className="w-6 text-gray-800" />
      <div className=" bg-gray-800 text-white p-2 rounded-lg">
        <h2 className="nunito-bold">{tooltipContent.date}</h2>
        <h3>Total : {tooltipContent.count}</h3>
        {tooltipContent.detail.map((serviceStat:StatisticsDetail) => (
          <div key={serviceStat.service}>
            <p>{serviceStat.service} : {serviceStat.number}</p>
          </div>
        ))}
      </div>
    </div>
)}
    </div>
  );
}

export default AnnualChart;
