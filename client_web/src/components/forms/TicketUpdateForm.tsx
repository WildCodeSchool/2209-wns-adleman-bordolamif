import { useForm } from 'react-hook-form';
import { TicketInput } from '@utils/types/InputTypes';
import { TicketData } from '@utils/types/DataTypes';
import ServiceIcon from '@components/icons/ServiceIcon';
import { StatusObjectEnum } from '@utils/enum/objects/StatusObjectEnum';

interface Props {
    ticketToUpdate: TicketData;
    handleUpdateTicket: (data:TicketInput, id:number) => void
    handleCloseModal: () => void
}

function TicketUpdateForm(props : Props) {
  const {
    ticketToUpdate, handleCloseModal, handleUpdateTicket,
  } = props;

  const { register, handleSubmit } = useForm<TicketInput>({
    defaultValues: ticketToUpdate,
  });

  const onSubmit = async (data: TicketInput) => {
    const ticketToSend: TicketInput = {
      name: ticketToUpdate.name,
      isFirstTime: ticketToUpdate.isFirstTime,
      status: Number(data.status),
      user: undefined,
      service: { id: ticketToUpdate.service.id },
    };
    await handleUpdateTicket(ticketToSend, ticketToUpdate.id);
    handleCloseModal();
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row items-center justify-center gap-4">
            <ServiceIcon service={ticketToUpdate.service} />
            <p className="text-4xl nunito-bold">{ticketToUpdate.service.name}</p>
          </div>
          <p className="text-center mb-4">{ticketToUpdate.name}</p>
          <select
            className="f-select"
            {...register('status')}
            defaultValue={
              StatusObjectEnum.find((stat) => stat.key === ticketToUpdate.status)
                ? ticketToUpdate.status
                : ''
            }
          >
            {StatusObjectEnum.map((stat) => (
              <option key={stat.key} value={stat.key}>{stat.name}</option>
            ))}
          </select>
          <div className="flex flex-row items-center gap-8 mt-4">
            <button
              type="submit"
              className="f-button-green"
            >
              Enregistrer
            </button>
            <button
              type="button"
              className="f-button-red"
              onClick={() => handleCloseModal()}
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>

  );
}

export default TicketUpdateForm;
