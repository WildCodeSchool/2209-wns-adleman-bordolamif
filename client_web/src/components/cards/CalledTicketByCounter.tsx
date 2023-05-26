import TicketDetails from '@components/details/TicketDetails';
import { TicketData } from '@utils/types/DataTypes';

interface Props {
  ticketsList:TicketData[]
}

function CalledTicketByCounter(props:Props) {
  const { ticketsList } = props;
  return (
    <div className="bg-gray-800 mx-4 mt-4 mb-20 pt-4 pl-6 pr-12 rounded-3xl drop-shadow">
      <h2 className="text-white text-center text-5xl mt-4 nunito-bold">Tickets appelés</h2>
      <p className="text-white text-center text-3xl my-8">Merci de vous rendre au guichet annoncé</p>
      <div className="grid grid-cols-2 gap-10 bg-red-100">
        {ticketsList! && ticketsList.map(
          (ticket) => (
            <div
              key={ticket.id}
              className="border-4 border-white rounded-2xl w-80"
              style={{ backgroundColor: `${ticket.service.color}` }}
            >
              <TicketDetails ticket={ticket} />
              <p className="relative top-4 bg-white text-black px-4 py-1 text-3xl rounded-xl mx-auto nunito-bold w-fit">{ticket.counter.name}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default CalledTicketByCounter;
