import { TicketData } from '@utils/types/DataTypes';
import { StartEndDate } from '@utils/types/InputTypes';

export const transformDataForExcelDownload = (ticketList: TicketData[]) => ticketList
  .map((ticket) => {
    const waitingTimeInSeconds = ticket.calledAt
      ? (new Date(ticket.calledAt).getTime() - new Date(ticket.createdAt).getTime()) / 1000
      : null;
    const processingTimeInSeconds = ticket.closedAt
      ? (new Date(ticket.closedAt).getTime() - new Date(ticket.calledAt).getTime()) / 1000
      : null;

    return {
      name: ticket.name,
      createdAt: ticket.createdAt,
      waitingTimeInSeconds,
      processingTimeInSeconds,
      isFirstTime: ticket.isFirstTime,
      isReturned: ticket.isReturned,
      ServiceName: ticket.service.name,
    };
  });

export const averageWaitingTime = (ticketList: TicketData[]) => {
  let totalWaitingTime = 0;
  let numCalledTickets = 0;

  for (const ticket of ticketList) {
    if (ticket.calledAt) {
      const waitTime = new Date(ticket.calledAt).getTime() - new Date(ticket.createdAt).getTime();
      totalWaitingTime += waitTime;
      numCalledTickets += 1;
    }
  }

  return Math.round(totalWaitingTime / (numCalledTickets * 60000));
};

export const mostPupularService = (ticketList: TicketData[]) => {
  const serviceCounts:{[serviceName:string]:number} = {};
  ticketList.forEach((ticket:TicketData) => {
    const serviceName = ticket.service.name;
    serviceCounts[serviceName] = serviceCounts[serviceName] || 0;
    serviceCounts[serviceName] += 1;
  });
  const maxServiceCount = Math.max(...Object.values(serviceCounts));
  return Object.keys(serviceCounts)
    .find((serviceName) => serviceCounts[serviceName] === maxServiceCount);
};

export const percentageOfReturnedTickets = (ticketList: TicketData[]) => {
  const returnedCount = ticketList
    .filter((ticket:TicketData) => ticket.isReturned).length;

  return ((returnedCount / ticketList.length) * 100).toFixed();
};

export const attendanceByService = (ticketList: TicketData[]) => {
  const servicesData: { [serviceId: number]
        : { name: string; color: string; count: number } } = {};
  if (ticketList) {
    ticketList.forEach((ticket:TicketData) => {
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

export const ticketsPerDay = (dateInterval: StartEndDate, ticketList: TicketData[]) => {
  const startDate = new Date(dateInterval!.startDate);
  const endDate = new Date(dateInterval!.endDate);
  const result = [];

  while (startDate <= endDate) {
    const currentDate = startDate.getDate().toString().padStart(2, '0');
    const currentMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = startDate.getFullYear().toString();
    const currentDateString = `${currentDate}-${currentMonth}-${currentYear}`;

    const ticketsOnCurrentDate = ticketList.filter(
      (ticket: TicketData) => ticket.createdAt.substring(0, 10) === currentDateString.split('-').reverse().join('-'),
    );
    const ticketsNb = ticketsOnCurrentDate.length;
    result.push({ date: currentDateString, ticketsNb });
    startDate.setDate(startDate.getDate() + 1);
  }

  return result;
};

export const averageWaitingTimePerService = (ticketList: TicketData[]) => {
  const servicesMap = new Map<number, { name: string; color: string; waitingTimes: number[] }>();

  for (const ticket of ticketList) {
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
