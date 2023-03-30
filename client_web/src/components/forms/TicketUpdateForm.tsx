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
    <div className="flex h-full justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <p>{ticketToUpdate.service.name}</p>
          <ServiceIcon service={ticketToUpdate.service} />
          <p>{ticketToUpdate.name}</p>
          <select
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
          <button
            type="submit"
            className="f-button-green"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>

  );
}

export default TicketUpdateForm;
