import { useLazyQuery, useQuery } from '@apollo/client';
import AnnualChart from '@components/charts/AnnualChart';
import AverageWaitingTimePerService from '@components/charts/AverageWaitingTimePerService';
import TicketsByServicesChart from '@components/charts/TicketsByServicesChart';
import TicketsPerDayChart from '@components/charts/TicketsPerDayChart';
import DateTimePicker from '@components/utils/DateTimePicker';
import {
  GET_ALL_TICKETS_BETWEEN_TWO_DATES,
  GET_LAST_YEAR_STATISTICS,
} from '@graphQL/query/ticketQuery';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportAnnualStats, exportPeriodTickets } from '@utils/excel';
import {
  attendanceByService,
  averageWaitingTime,
  averageWaitingTimePerService,
  mostPupularService,
  percentageOfReturnedTickets,
  ticketsPerDay,
} from '@utils/statistics/statFunctions';
import { StartEndDate } from '@utils/types/InputTypes';
import { DailyStatistics } from '@utils/types/StatisticsTypes';
import { useState } from 'react';

function AdminStatistics() {
  const [dateInterval, setDateInterval] = useState<StartEndDate>();
  const [getAllTicketsBetweenTwoDates, { data: ticketList }] = useLazyQuery(
    GET_ALL_TICKETS_BETWEEN_TWO_DATES,
  );
  const { data: annualStatistics } = useQuery(GET_LAST_YEAR_STATISTICS);
  const stats : DailyStatistics[] = annualStatistics && annualStatistics!.getLastYearStatistics;
  const validateDateInterval = (dates: StartEndDate) => {
    setDateInterval(dates);
    getAllTicketsBetweenTwoDates({ variables: { data: dates } });
  };
  return (
    <div>
      { annualStatistics!
        && (
          <>
            <AnnualChart annualStatistics={stats} />
            <div className="flex flex-col items-end mr-8 mb-2 z-0">
              <button
                type="button"
                className="f-button-statistics"
                onClick={() => exportAnnualStats(stats)}
              >
                <ArrowDownTrayIcon className="w-5 mr-4 -z-10" />
                Télécharger les données annuelles en format Excel
              </button>
            </div>
          </>
        ) }
      <div className="h-[2px] w-2/3 bg-gray-400 mx-auto my-8" />
      <div>
        <DateTimePicker validateDateInterval={validateDateInterval} />
        {ticketList ? (
          <div className="flex flex-col mt-6">
            <div className="f-format-services">
              <div className="f-hub-colors bg-amber-100">
                <p className="f-bold3xl text-amber-500">{ticketList && ticketList.getAllTicketsBetweenTwoDates.length}</p>
                <p>Tickets traités</p>
              </div>
              <div className="f-hub-colors bg-orange-100">
                <p className="f-bold3xl text-orange-500">{ticketList
                && ticketList.getAllTicketsBetweenTwoDates.length
                && averageWaitingTime(ticketList.getAllTicketsBetweenTwoDates)} minutes
                </p>
                <p>Temps d'attente moyen</p>
              </div>
              <div className="f-hub-colors bg-red-100">
                <p className="f-bold3xl text-red-500">{ticketList && mostPupularService(ticketList.getAllTicketsBetweenTwoDates)}</p>
                <p>Service le plus fréquenté</p>
              </div>
              <div className="f-hub-colors bg-lime-100">
                <p className="f-bold3xl text-lime-500">{ticketList
                && ticketList.getAllTicketsBetweenTwoDates.length
                && percentageOfReturnedTickets(ticketList
                  .getAllTicketsBetweenTwoDates)} %
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
            <div className="flex flex-col items-end mt-4">
              <button
                type="button"
                className="f-button-statistics"
                onClick={() => exportPeriodTickets(ticketList.getAllTicketsBetweenTwoDates)}
              >
                <ArrowDownTrayIcon className="w-5 mr-4" />
                Télécharger les données de la période en format Excel
              </button>
            </div>
          </div>
        ) : <div className="text-center mt-2 mb-2 text-xl">Veuillez selectionner la période à afficher</div>}
      </div>
    </div>
  );
}
export default AdminStatistics;
