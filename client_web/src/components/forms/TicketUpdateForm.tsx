import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { TicketInput } from '@utils/types/InputTypes';
import { TicketData } from '@utils/types/DataTypes';
import ServiceIcon from '@components/icons/ServiceIcon';

interface Props {
    ticketToUpdate: TicketData;
    handleUpdateTicket: (data:TicketInput, id:number) => void
    handleCloseModal: () => void
}

const status = [{ name: 'En attente', key: 1 }, { name: 'Ajourné', key: 2 }, { name: 'En traitement', key: 3 }, { name: 'Traité', key: 4 }];

function TicketUpdateForm(props : Props) {
  const {
    ticketToUpdate, handleCloseModal, handleUpdateTicket,
  } = props;

  const [error, setError] = useState('');

  const { register, handleSubmit, reset } = useForm<TicketInput>({
    defaultValues: ticketToUpdate,
  });

  const onSubmit = async (data: TicketInput) => {
    // try {
    //   const userToSend:UserInput = {
    //     firstname: data.firstname!,
    //     lastname: data.lastname!,
    //     email: data.email!,
    //     role: userToUpdate?.role || 2,
    //     services: userServices,
    //   };
    //   if (userToUpdate) {
    //     await handleUpdateUser(userToSend, userToUpdate.id);
    //   } else await handleCreateUser(userToSend);
    //   // refetch
    //   handleCloseModal();
    // } catch (submitError) {
    //   if (userToUpdate) setError('Error while trying to create user');
    //   else setError('Error while trying to edit user');
    // }
  };

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';
  return (
    <div className="flex h-full justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <p>{ticketToUpdate.service.name}</p>
          <ServiceIcon service={ticketToUpdate.service} />
          <input placeholder="Service" {...register('service')} readOnly className={inputClassName} />
          <input placeholder="Name" {...register('name')} readOnly className={inputClassName} />
          <select {...register('status')}>
            {status.map((stat) => (
              <option key={stat.key} value={stat.key}>{stat.name}</option>
            ))}
          </select>
          <button type="submit" className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-3/6">Enregistrer</button>
          <div>
            {error && <div>{error}</div>}
          </div>
        </div>
      </form>
    </div>

  );
}

export default TicketUpdateForm;
