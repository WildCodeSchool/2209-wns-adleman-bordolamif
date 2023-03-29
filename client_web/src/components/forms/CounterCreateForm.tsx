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

  const onSubmit = async (data: CounterInput) => {
    await handleCreateCounter(data);
    setIsCreateCounter(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Nom du guichet</h2>
      <input
        placeholder="Ex: Guichet 1"
        {...register('name')}
        required
        className="f-input"
      />
      <div className="flex flex-row justify-end space-x-4">
        <button
          className="f-button-red"
          type="button"
          onClick={() => setIsCreateCounter(false)}
        >
          Annuler
        </button>
        <button
          className="f-button-green"
          type="submit"
        >
          Appliquer
        </button>
      </div>
    </form>
  );
}

export default CounterCreateForm;
