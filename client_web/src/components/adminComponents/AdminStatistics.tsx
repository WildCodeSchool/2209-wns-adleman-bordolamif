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
      <div>
        <DateTimePicker validateDateInterval={validateDateInterval} />
        {ticketList ? (
          <div className="flex flex-col">
            <button
              type="button"
              className="f-button-green mt-2 ml-6 self-center"
              onClick={() => exportPeriodTickets(ticketList.getAllTicketsBetweenTwoDates)}
            >Télécharger les données de la période en format Excel
            </button>
            <div className="f-format-services">
              <div className="bg-amber-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-amber-500">{ticketList && ticketList.getAllTicketsBetweenTwoDates.length}</p>
                <p>Tickets traités</p>
              </div>
              <div className="bg-orange-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-orange-500">{ticketList
                && ticketList.getAllTicketsBetweenTwoDates.length
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
          </div>
        ) : <div className="text-center mt-2 mb-2">Veuillez selectionner la période à afficher</div>}
      </div>
      { annualStatistics!
        && (
          <>
            <AnnualChart annualStatistics={stats} />
            <button
              type="button"
              className="f-button-green mt-2 ml-6"
              onClick={() => exportAnnualStats(stats)}
            >Télécharger les données annuelles en format Excel
            </button>
          </>
        ) }
    </div>

  );
}
export default AdminStatistics;
