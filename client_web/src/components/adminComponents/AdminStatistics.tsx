import { useLazyQuery, useQuery } from '@apollo/client';
import AverageWaitingTimePerService from '@components/charts/AverageWaitingTimePerService';
import TicketsByServicesChart from '@components/charts/TicketsByServicesChart';
import TicketsPerDayChart from '@components/charts/TicketsPerDayChart';
import DateTimePicker from '@components/utils/DateTimePicker';
import {
  GET_ALL_TICKETS_BETWEEN_TWO_DATES,
  GET_LAST_YEAR_STATISTICS,
} from '@graphQL/query/ticketQuery';
import { getOneYearAgo, getYesterday } from '@utils/dates';
import {
  attendanceByService,
  averageWaitingTime,
  averageWaitingTimePerService,
  mostPupularService,
  percentageOfReturnedTickets,
  ticketsPerDay,
} from '@utils/statistics/statFunctions';
import { StartEndDate } from '@utils/types/InputTypes';
import { DailyHeatmapStat, DailyStatistics } from '@utils/types/StatisticsTypes';

import { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

function AdminStatistics() {
  const [dateInterval, setDateInterval] = useState<StartEndDate>();
  const [getAllTicketsBetweenTwoDates, { data: ticketList }] = useLazyQuery(
    GET_ALL_TICKETS_BETWEEN_TWO_DATES,
  );
  const { data: annualStatistics } = useQuery(GET_LAST_YEAR_STATISTICS);

  const validateDateInterval = (dates: StartEndDate) => {
    setDateInterval(dates);
    getAllTicketsBetweenTwoDates({ variables: { data: dates } });
  };

  const getCalendarCountColor = (day: DailyHeatmapStat) => {
    if (day === null || !day) {
      return 'color-github-0';
    }
    if (day.count < 10) {
      return 'color-github-1';
    }
    if (day.count < 20) {
      return 'color-github-2';
    }
    if (day.count < 50) {
      return 'color-github-3';
    }
    return 'color-github-4';
  };

  return (
    <div>
      <div>
        <DateTimePicker validateDateInterval={validateDateInterval} />
        {ticketList ? (
          <div className="flex flex-col">
            <div className="f-format-services">
              <div className="bg-amber-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-amber-500">{ticketList && ticketList.getAllTicketsBetweenTwoDates.length}</p>
                <p>Tickets traités</p>
              </div>
              <div className="bg-orange-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-orange-500">{ticketList
                && averageWaitingTime(ticketList.getAllTicketsBetweenTwoDates)} minutes
                </p>
                <p>Temps d'attente moyen</p>
              </div>
              <div className="bg-red-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-red-500">{ticketList && mostPupularService(ticketList.getAllTicketsBetweenTwoDates)}</p>
                <p>Service le plus fréquenté</p>
              </div>
              <div className="bg-lime-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-lime-500">{ticketList
                && percentageOfReturnedTickets(ticketList.getAllTicketsBetweenTwoDates)} %
                </p>
                <p>Tickets ajournés</p>
              </div>
            </div>
            <div className="f-format-around-center">
              <div className="flex flex-col">
                <h3 className="ml-4">Nombre de ticket par jour</h3>
                <div className="w-[120%]">
                  <TicketsPerDayChart
                    chartData={
                      ticketsPerDay(dateInterval!, ticketList.getAllTicketsBetweenTwoDates)
                    }
                  />
                </div>
                <h3 className="ml-4 mt-4">Temps d'attente moyen par service en minutes</h3>
                <div>
                  <AverageWaitingTimePerService
                    chartData={
                      averageWaitingTimePerService(ticketList.getAllTicketsBetweenTwoDates)
                    }
                  />
                </div>
              </div>
              <div>
                <h3>Passer la souris sur le diagramme pour en savoir plus</h3>
                <div className="mt-4">
                  <TicketsByServicesChart
                    chartData={attendanceByService(ticketList.getAllTicketsBetweenTwoDates)}
                  />
                </div>
              </div>
            </div>
            { annualStatistics!
            && (
            <div>
              <h2>Statistiques annuelles</h2>
              <div className="max-w-4xl ">
                <CalendarHeatmap
                  startDate={getOneYearAgo()}
                  endDate={getYesterday()}
                  values={
                    annualStatistics!.getLastYearStatistics.map(
                      (day: DailyStatistics) => ({ date: day.date, count: day.total }),
                    )
                }
                  classForValue={getCalendarCountColor}
                  showWeekdayLabels
                />

              </div>
            </div>
            ) }
          </div>
        ) : <div className="text-center mt-2 mb-2">Veuillez selectionner la période à afficher</div>}
      </div>
    </div>

  );
}
export default AdminStatistics;
