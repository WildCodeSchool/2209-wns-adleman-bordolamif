import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Counter } from '@utils/types/DataTypes';
import { CounterInput } from '@utils/types/InputTypes';
import { useForm } from 'react-hook-form';

interface Props {
    counter: Counter
    waitingRoomId: number
    setIsEdit: (isEdit: boolean) => void
    handleUpdateCounter: (data: CounterInput, id: number) => void

}

function CounterEditForm(props: Props) {
  const {
    counter, waitingRoomId, setIsEdit, handleUpdateCounter,
  } = props;
  const formDefaultValues = { name: counter.name, waitingRoom: { id: waitingRoomId } };
  const { register, handleSubmit } = useForm<CounterInput>({
    defaultValues: formDefaultValues,
  });

  const onSubmit = async (data: CounterInput) => {
    await handleUpdateCounter(data, counter.id);
    setIsEdit(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-raw">
      <input
        placeholder="Ex: Guichet 1"
        {...register('name')}
        required
        className="w-[8rem] py-1 px-2 text-gray-700 bg-gray-100 focus:outline-none mr-1"
      />
      <div className="flex flex-raw">
        <button
          type="button"
          aria-label="cancel"
          onClick={() => setIsEdit(false)}
        >
          <XMarkIcon className="w-4 text-red-600" />
        </button>
        <button
          type="submit"
          aria-label="submit"
        >
          <CheckIcon className="w-4 text-green-600" />
        </button>
      </div>
    </form>
  );
}

export default CounterEditForm;
