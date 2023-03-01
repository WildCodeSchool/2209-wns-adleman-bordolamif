import { TicketData } from '@utils/types/DataTypes';

interface Props {
    ticket: TicketData,
}

function TicketDetails(props: Props) {
  const { ticket } = props;

  return (
    <div className="w-20 rounded m-1 p-1" style={{ backgroundColor: `${ticket.service.color}` }}>
      <p>{ticket.name}</p>
    </div>
  );
}
export default TicketDetails;
