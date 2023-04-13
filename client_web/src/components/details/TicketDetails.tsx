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
        className="rounded p-2 m-2 text-white nunito-bold text-xl"
        style={{ backgroundColor: `${ticket.service.color}` }}
      >
        <p>{ticket.name}</p>
      </button>
      )}
      {!handleOpenModal && (
        <div
          className="f-card-waitingroom"
          style={{ backgroundColor: `${ticket.service.color}` }}
        ><p className="text-5xl">{ticket.name}</p>
        </div>
      )}
    </>

  );
}

TicketDetails.defaultProps = defaultProps;

export default TicketDetails;
