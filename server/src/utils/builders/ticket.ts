import Service from '../../entity/Service';
import Ticket from '../../entity/Ticket';

const getSuffix = (todaysTicketsServices: Ticket[]) => {
  if (!todaysTicketsServices.length || todaysTicketsServices === undefined || todaysTicketsServices[0].name.substring(4, 7) === '999') {
    return '001';
  }
  return (parseInt(todaysTicketsServices[0].name.substring(4, 7), 10) + 1).toString().padStart(3, '0');
};

export const ticketNameBuilder = (ticketService:Service, todaysTicketsServices: Ticket[]) => {
  const prefix = ticketService.acronym;
  const suffix = getSuffix(todaysTicketsServices);
  return `${prefix}-${suffix}`;
};

export const ticketStatusUpdater = (ticketToUpdate: Ticket, status: number) => {
  switch (status) {
    case 2: {
      ticketToUpdate.isReturned = true;
      ticketToUpdate.status = status;
      break;
    }
    case 3: {
      ticketToUpdate.calledAt = new Date();
      ticketToUpdate.status = status;
      break;
    }
    case 4: {
      ticketToUpdate.closedAt = new Date();
      ticketToUpdate.status = status;
      break;
    }
    default: ticketToUpdate.status = status;
  }
};
