import { CounterInput } from '@utils/types/InputTypes';
import { useForm } from 'react-hook-form';

interface Props {
    waitingRoomId: number
    setIsCreateCounter: (isEdit: boolean) => void
    handleCreateCounter: (data: CounterInput) => void

}

function CounterCreateForm(props: Props) {
  const {
    waitingRoomId, setIsCreateCounter, handleCreateCounter,
  } = props;
  const formDefaultValues = { waitingRoom: { id: waitingRoomId } };
  const { register, handleSubmit } = useForm<CounterInput>({
    defaultValues: formDefaultValues,
  });

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';

  const onSubmit = async (data: CounterInput) => {
    await handleCreateCounter(data);
    setIsCreateCounter(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Nom du guichet</h2>
      <input placeholder="Ex: Guichet 1" {...register('name')} required className={inputClassName} />
      <div className="flex flex-row justify-end">
        <button
          className="p-2 mx-2 w-[5rem] bg-red-600 rounded text-white hover:bg-red-700"
          type="button"
          onClick={() => setIsCreateCounter(false)}
        >
          Annuler
        </button>
        <button
          className="p-2 mx-2 w-fit bg-green-600 rounded text-white hover:bg-green-700"
          type="submit"
        >
          Appliquer
        </button>
      </div>
    </form>
  );
}

export default CounterCreateForm;
