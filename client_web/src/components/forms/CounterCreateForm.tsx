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
      <input placeholder="Name" {...register('name')} required className={inputClassName} />
      <div className="flex flex-col">
        <button
          className="p-2 my-2 bg-red-600 rounded-xl w-2 h-2"
          type="button"
          aria-label="cancel"
          onClick={() => setIsCreateCounter(false)}
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

export default CounterCreateForm;
