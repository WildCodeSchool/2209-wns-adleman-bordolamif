import { TicketData } from '@utils/types/DataTypes';

interface RequiredProps {
  ticket: TicketData,
}
interface OptionalProps {
    handleOpenModal?: null | ((user:TicketData) => void)
    mode?: string | null
}

interface Props extends RequiredProps, OptionalProps{}

const defaultProps:OptionalProps = {
  handleOpenModal: null,
  mode: null,
};

function TicketDetails(props: Props) {
  const { ticket, handleOpenModal, mode } = props;

  const TVSCREEN = 'tvscreen';
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
        mode === TVSCREEN
          ? (
            <div
              className="f-card-waitingroom"
              style={{ backgroundColor: `${ticket.service.color}` }}
            ><p className="text-5xl">{ticket.name}</p>
            </div>
          )
          : (
            <div
              className="f-card-waitingroom w-fit px-4 mx-auto drop-shadow-lg mb-4 bg-white text-gray-700"
            >
              <div className="flex flex-row items-center">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: `${ticket.service.color}` }}
                />
                <p className="text-3xl text-black rounded-2xl ml-2">{ticket.name}</p>
              </div>
            </div>
          )
      )}
    </>
  );
}

TicketDetails.defaultProps = defaultProps;

export default TicketDetails;
