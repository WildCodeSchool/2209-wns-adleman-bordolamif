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

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';

  const onSubmit = async (data: CounterInput) => {
    await handleUpdateCounter(data, counter.id);
    setIsEdit(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Name" {...register('name')} required className={inputClassName} />
      <div className="flex flex-col">
        <button
          className="p-2 my-2 bg-red-600 rounded-xl w-2 h-2"
          type="button"
          aria-label="cancel"
          onClick={() => setIsEdit(false)}
        />
        <button
          className="p-2 my-2 bg-green-600 rounded-xl w-2 h-2"
          type="submit"
          aria-label="submit"
        />
      </div>
    </form>
  );
}

export default CounterEditForm;
