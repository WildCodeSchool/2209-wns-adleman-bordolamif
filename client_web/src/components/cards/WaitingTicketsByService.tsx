import { Service, TicketData } from '@utils/types/DataTypes';
import TicketDetails from '@components/details/TicketDetails';

interface RequiredProps {
  ticketsList: TicketData[]
  service: Service
}
interface OptionalProps {
    mode?: string | null
}

interface Props extends RequiredProps, OptionalProps{}

const defaultProps:OptionalProps = {
  mode: null,
};

function WaitingTicketsByService(props:Props) {
  const { ticketsList, service, mode } = props;
  return (
    <div>
      <div className="bg-gray-200 m-1 p-4 rounded-2xl h-full w-80 drop-shadow">
        <h3 className="text-3xl nunito-bold text-center">{service.name}</h3>
        {ticketsList! && ticketsList.slice(0, 3).map(
          (ticket) => ticket.status !== 4
          && <TicketDetails key={ticket.id} ticket={ticket} mode={mode} />,
        )}
        {ticketsList! && ticketsList.length > 3
      && <p className="text-3xl mt-6 text-center"> + {ticketsList.length - 3} tickets</p>}
      </div>
    </div>
  );
}

WaitingTicketsByService.defaultProps = defaultProps;

export default WaitingTicketsByService;
