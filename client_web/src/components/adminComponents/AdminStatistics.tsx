import { useLazyQuery } from '@apollo/client';
import AverageWaitingTimePerService from '@components/charts/AverageWaitingTimePerService';
import TicketsByServicesChart from '@components/charts/TicketsByServicesChart';
import TicketsPerDayChart from '@components/charts/TicketsPerDayChart';
import DateTimePicker from '@components/utils/DateTimePicker';
import { GET_ALL_TICKETS_BETWEEN_TWO_DATES } from '@graphQL/query/ticketQuery';
import {
  attendanceByService,
  averageWaitingTime,
  averageWaitingTimePerService,
  mostPupularService,
  percentageOfReturnedTickets,
  ticketsPerDay,
} from '@utils/statistics/statFunctions';
import { StartEndDate } from '@utils/types/InputTypes';
import { useState } from 'react';

function AdminStatistics() {
  const [dateInterval, setDateInterval] = useState<StartEndDate>();
  const [getAllTicketsBetweenTwoDates, { data: ticketList }] = useLazyQuery(
    GET_ALL_TICKETS_BETWEEN_TWO_DATES,
  );

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
            <div className="flex">
              <div className="bg-orange-800 text-white rounded-2xl p-3 m-1">
                <p>{ticketList && ticketList.getAllTicketsBetweenTwoDates.length}</p>
                <p>Tickets traités</p>
              </div>
              <div className="bg-orange-600 text-white rounded-2xl p-3 m-1">
                <p>{ticketList
                && averageWaitingTime(ticketList.getAllTicketsBetweenTwoDates)} minutes
                </p>
                <p>Temps d'attente moyen</p>
              </div>
              <div className="bg-orange-700 text-white rounded-2xl p-3 m-1">
                <p>{ticketList && mostPupularService(ticketList.getAllTicketsBetweenTwoDates)}</p>
                <p>Service le plus fréquenté</p>
              </div>
              <div className="bg-orange-600 text-white rounded-2xl p-3 m-1">
                <p>{ticketList
                && percentageOfReturnedTickets(ticketList.getAllTicketsBetweenTwoDates)} %
                </p>
                <p>Tickets ajournés</p>
              </div>
            </div>
            <div>
              <p>Nombre de ticket total</p>
              <TicketsByServicesChart
                chartData={attendanceByService(ticketList.getAllTicketsBetweenTwoDates)}
              />
            </div>
            <div>
              <TicketsPerDayChart
                chartData={ticketsPerDay(dateInterval!, ticketList.getAllTicketsBetweenTwoDates)}
              />
            </div>
            <div>
              <AverageWaitingTimePerService
                chartData={averageWaitingTimePerService(ticketList.getAllTicketsBetweenTwoDates)}
              />
            </div>
          </div>
        ) : <div>Veuillez selectionner la période à afficher</div>}
      </div>
      <div>
        <div className="f-decoration-line-for-tab" />
        <p>Récapitulatif annuel</p>
        {/* <AnnualChart /> */}
      </div>
    </div>

  );
}
export default AdminStatistics;
