import { useLazyQuery } from '@apollo/client';
import AnnualChart from '@components/charts/AnnualChart';
import AverageWaitingTimePerService from '@components/charts/AverageWaitingTimePerService';
import TicketsByServicesChart from '@components/charts/TicketsByServicesChart';
import TicketsPerDayChart from '@components/charts/TicketsPerDayChart';
import DateTimePicker from '@components/utils/DateTimePicker';
import { GET_ALL_TICKETS_BETWEEN_TWO_DATES } from '@graphQL/query/ticketQuery';
import { TicketData } from '@utils/types/DataTypes';
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

  const averageWaitingTime = () => {
    let totalWaitingTime = 0;
    let numCalledTickets = 0;

    for (const ticket of ticketList.getAllTicketsBetweenTwoDates) {
      if (ticket.calledAt) {
        const waitTime = new Date(ticket.calledAt).getTime() - new Date(ticket.createdAt).getTime();
        totalWaitingTime += waitTime;
        numCalledTickets += 1;
      }
    }

    return Math.round(totalWaitingTime / (numCalledTickets * 60000));
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

  const attendanceByService = () => {
    const servicesData: { [serviceId: number]
        : { name: string; color: string; count: number } } = {};
    if (ticketList) {
      ticketList.getAllTicketsBetweenTwoDates.forEach((ticket:TicketData) => {
        const serviceId = ticket.service.id;
        if (!servicesData[serviceId]) {
          servicesData[serviceId] = {
            name: ticket.service.name,
            color: ticket.service.color,
            count: 1,
          };
        } else {
          servicesData[serviceId].count += 1;
        }
      });
    }
    const chartData = Object.values(servicesData).map((serviceData) => ({
      name: serviceData.name,
      color: serviceData.color,
      ticketsNb: serviceData.count,
    }));
    return chartData;
  };

  const ticketsPerDay = () => {
    const startDate = new Date(dateInterval!.startDate);
    const endDate = new Date(dateInterval!.endDate);
    const result = [];

    while (startDate <= endDate) {
      const currentDate = startDate.getDate().toString().padStart(2, '0');
      const currentMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
      const currentYear = startDate.getFullYear().toString();
      const currentDateString = `${currentDate}-${currentMonth}-${currentYear}`;

      const ticketsOnCurrentDate = ticketList.getAllTicketsBetweenTwoDates.filter(
        (ticket: TicketData) => ticket.createdAt.substring(0, 10) === currentDateString.split('-').reverse().join('-'),
      );
      const ticketsNb = ticketsOnCurrentDate.length;
      result.push({ date: currentDateString, ticketsNb });
      startDate.setDate(startDate.getDate() + 1);
    }

    return result;
  };

  const averageWaitingTimePerService = () => {
    const servicesMap = new Map<number, { name: string; color: string; waitingTimes: number[] }>();

    for (const ticket of ticketList.getAllTicketsBetweenTwoDates) {
      if (ticket.calledAt != null) {
        const serviceId = ticket.service.id;
        const service = servicesMap.get(serviceId);
        const waitingTime = (new Date(ticket.calledAt).getTime()
        - new Date(ticket.createdAt).getTime()) / (1000 * 60);

        if (service) {
          service.waitingTimes.push(waitingTime);
        } else {
          servicesMap.set(serviceId, {
            name: ticket.service.name,
            color: ticket.service.color,
            waitingTimes: [waitingTime],
          });
        }
      }
    }
    const chartData = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [serviceId, service] of servicesMap.entries()) {
      const waitingTimes = service.waitingTimes.length ? service.waitingTimes : [0];
      const waitingTime = ((waitingTimes.reduce((acc, time) => acc + time, 0))
      / waitingTimes.length).toFixed();
      chartData.push({
        name: service.name,
        color: service.color,
        waitingTime: parseInt(waitingTime, 10),
      });
    }
    return chartData;
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
            <div>
              <p>Nombre de ticket total</p>
              <TicketsByServicesChart chartData={attendanceByService()} />
            </div>
            <div>
              <TicketsPerDayChart chartData={ticketsPerDay()} />
            </div>
            <div>
              <AverageWaitingTimePerService chartData={averageWaitingTimePerService()} />
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
