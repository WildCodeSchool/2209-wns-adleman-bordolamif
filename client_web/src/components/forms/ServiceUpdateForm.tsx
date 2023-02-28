import { useQuery } from '@apollo/client';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
import { ServiceData } from '@utils/types/DataTypes';
import { WaitingRoomId } from '@utils/types/InputIdTypes';
import { ServiceInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { useForm } from 'react-hook-form';
import WaitingRoomsRadioList from './WaitingRoomsRadioList';

interface Props {
  serviceToUpdate: ServiceData
  setIsUpdateService: (isEdit: boolean) => void
  handleUpdateService: (data: ServiceInput, id: number) => void
}

function ServiceUpdateForm(props: Props) {
  const { serviceToUpdate, setIsUpdateService, handleUpdateService } = props;
  const [serviceWaitingRoom,
    setServiceWaitingRoom] = useState<WaitingRoomId>({ id: serviceToUpdate.waitingRoom.id });
  const [color, setColor] = useState<string>(serviceToUpdate.color);
  const [pickerVisible, setPickerVisbile] = useState(false);

  const {
    loading: waitingRoomsListLoading,
    data: waitingRoomsList,
  } = useQuery(GET_ALL_WAITINGROOMS);

  const { register, handleSubmit } = useForm<ServiceInput>({
    defaultValues: serviceToUpdate,
  });

  const handleColorPicker = () => { setPickerVisbile(!pickerVisible); };

  const handleColorChange = (colorResult: ColorResult) => {
    setColor(colorResult.hex);
  };

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';

  const toggleServiceWaitingRoom = (id:number) => {
    setServiceWaitingRoom({ id });
  };

  const onSubmit = async (data: ServiceInput) => {
    const updatedService = {
      name: data.name,
      open: false,
      acronym: (data.acronym).toUpperCase(),
      color,
      waitingRoom: serviceWaitingRoom,
    };

    await handleUpdateService(updatedService, serviceToUpdate.id);
    setIsUpdateService(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Nom" {...register('name')} required className={inputClassName} />
      {waitingRoomsListLoading && <p>Loading...</p>}
      <WaitingRoomsRadioList
        radioChecked={serviceWaitingRoom}
        waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
        toggleRadioList={toggleServiceWaitingRoom}
      />
      <input placeholder="Acronyme" className={inputClassName} {...register('acronym', { required: true, maxLength: 3 })} />
      <button type="button" className="p-1 bg-white rounded shadow inline-block cursor-pointer" onClick={handleColorPicker}>
        <div className="w-14 h-6 rounded" style={{ backgroundColor: `${color}` }} />
      </button>
      {pickerVisible && <ChromePicker color={color} onChangeComplete={handleColorChange} />}
      <div className="flex flex-col">
        <button
          className="p-2 my-2 bg-red-600 rounded-xl w-2 h-2"
          type="button"
          aria-label="cancel"
          onClick={() => setIsUpdateService(false)}
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

export default ServiceUpdateForm;