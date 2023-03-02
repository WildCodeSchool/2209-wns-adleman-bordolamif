import { TicketData } from '@utils/types/DataTypes';

interface RequiredProps {
  ticket: TicketData,

}
interface OptionalProps {
    handleOpenModal?: null | ((user:TicketData) => void)
}

interface Props extends RequiredProps, OptionalProps{}

const defaultProps:OptionalProps = {
  handleOpenModal: null,
};

function TicketDetails(props: Props) {
  const { ticket, handleOpenModal } = props;

  return (
    <>
      {handleOpenModal && (
      <button
        type="button"
        onClick={() => handleOpenModal(ticket)}
        className="w-20 rounded m-1 p-1"
        style={{ backgroundColor: `${ticket.service.color}` }}
      >
        <p>{ticket.name}</p>
      </button>
      )}
      {!handleOpenModal && (
        <div
          className="w-20 rounded m-1 p-1"
          style={{ backgroundColor: `${ticket.service.color}` }}
        ><p>{ticket.name}</p>
        </div>
      )}
    </>

  );
}

TicketDetails.defaultProps = defaultProps;

export default TicketDetails;
