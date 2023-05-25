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
        className="rounded-xl w-32 py-2 m-2 text-white nunito-bold text-xl hover:scale-105"
        style={{ backgroundColor: `${ticket.service.color}` }}
      >
        <p>{ticket.name}</p>
      </button>
      )}
      {!handleOpenModal && (
        <div
          className="f-card-waitingroom w-fit px-4 mx-auto drop-shadow-lg mb-4 bg-white"
          style={{ color: `${ticket.service.color}` }}
        >
          <p className="text-4xl">{ticket.name}</p>
        </div>
      )}
    </>

  );
}

TicketDetails.defaultProps = defaultProps;

export default TicketDetails;
