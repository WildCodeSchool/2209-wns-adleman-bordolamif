import { useLazyQuery, useQuery } from '@apollo/client';
import DateTimePicker from '@components/utils/DateTimePicker';
import { GET_ALL_TICKETS_BETWEEN_TWO_DATES } from '@graphQL/query/ticketQuery';
import { TicketData } from '@utils/types/DataTypes';
import { StartEndDate } from '@utils/types/InputTypes';
import { useState } from 'react';

function AdminStatistics() {
  const [getAllTicketsBetweenTwoDates, { data: ticketList }] = useLazyQuery(
    GET_ALL_TICKETS_BETWEEN_TWO_DATES,
  );

  const validateDateInterval = (dates: StartEndDate) => {
    getAllTicketsBetweenTwoDates({ variables: { data: dates } });
  };

  const averageWaitingTime = () => {
    const totalWaitingTime = ticketList.getAllTicketsBetweenTwoDates
      .reduce((acc:number, ticket: TicketData) => {
        if (ticket.calledAt) {
          const waitTime = new Date(ticket.calledAt)
            .getTime() - new Date(ticket.createdAt).getTime();
          return acc + waitTime;
        }
        return acc;
      }, 0);
    return Math.round(totalWaitingTime / (ticketList.getAllTicketsBetweenTwoDates.length * 60000));
  };

  const mostPupularService = () => {
    const serviceCounts:{[serviceName:string]:number} = {};
    ticketList.getAllTicketsBetweenTwoDates.forEach((ticket:TicketData) => {
      const serviceName = ticket.service.name;
      serviceCounts[serviceName] = serviceCounts[serviceName] || 0;
      serviceCounts[serviceName] += 1;
    });
    const maxServiceCount = Math.max(...Object.values(serviceCounts));
    return Object.keys(serviceCounts)
      .find((serviceName) => serviceCounts[serviceName] === maxServiceCount);
  };

  const percentageOfReturnedTickets = () => {
    const returnedCount = ticketList.getAllTicketsBetweenTwoDates
      .filter((ticket:TicketData) => ticket.isReturned).length;

    return ((returnedCount / ticketList.getAllTicketsBetweenTwoDates.length) * 100).toFixed();
  };

  return (
    <div>
      <DateTimePicker validateDateInterval={validateDateInterval} />
      <div className="flex">
        <div className="bg-orange-800 text-white rounded-2xl p-3 m-1">
          <p>{ticketList && ticketList.getAllTicketsBetweenTwoDates.length}</p>
          <p>Tickets traités</p>
        </div>
        <div className="bg-orange-600 text-white rounded-2xl p-3 m-1">
          <p>{ticketList && averageWaitingTime()} minutes</p>
          <p>Temps d'attente moyen</p>
        </div>
        <div className="bg-orange-700 text-white rounded-2xl p-3 m-1">
          <p>{ticketList && mostPupularService()}</p>
          <p>Service le plus fréquenté</p>
        </div>
        <div className="bg-orange-600 text-white rounded-2xl p-3 m-1">
          <p>{ticketList && percentageOfReturnedTickets()} %</p>
          <p>Tickets ajournés</p>
        </div>
      </div>
    </div>

  );
}
export default AdminStatistics;
