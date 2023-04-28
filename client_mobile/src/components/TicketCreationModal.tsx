import {
  Modal, Pressable, Text, View,
} from 'react-native';
import { useState } from 'react';
import { TicketInput } from '../types/InputTypes';
import { Service } from '../types/DataTypes';

interface Props {
  showModal: boolean,
  setShowModal: (showModal: boolean) => void
  serviceTicketToCreate: Service
  handleCreateTicket: (ticket: TicketInput) => void
  expoPushToken: string
}

function TicketCreationModal(props: Props) {
  const {
    showModal,
    setShowModal,
    serviceTicketToCreate,
    handleCreateTicket,
    expoPushToken,
  } = props;

  const [ticketToCreate, setTicketToCreate] = useState<TicketInput | null>();

  const handleConfirmService = () => {
    setTicketToCreate({
      isFirstTime: false,
      service: { id: serviceTicketToCreate.id },
      mobileToken: expoPushToken,
    });
  };

  const handleIsFirstTime = async (isFirstTime: boolean) => {
    const ticketToSend = {
      isFirstTime,
      service: { id: serviceTicketToCreate.id },
      mobileToken: expoPushToken,
    };
    await handleCreateTicket(ticketToSend);
    setTicketToCreate(null);
    setShowModal(false);
  };

  return (
    <Modal
      animationType="fade"
      visible={showModal}
      onRequestClose={() => {
        setShowModal(!showModal);
      }}
    >
      <View>
        { !ticketToCreate && (
        <View className="flex items-center">
          <Text className="text-center text-3xl">Confirmez-vous votre choix ?</Text>
          <View className="flex flex-row mt-4 space-x-4">
            <Pressable
              className="flex items-center bg-green-500 w-28 py-4 rounded-3xl active:scale-95"
              onPress={handleConfirmService}
            >
              <Text className="text-3xl nunito-bold text-white">OUI</Text>
            </Pressable>
            <Pressable
              className="flex items-center bg-red-500 w-28 py-4 rounded-3xl active:scale-95"
              onPress={() => setShowModal(!showModal)}
            >
              <Text className="text-3xl nunito-bold text-white">NON</Text>
            </Pressable>
          </View>
        </View>
        ) }
        { ticketToCreate && (
        <View className="flex items-center">
          <Text className="text-center text-3xl">Est-ce votre première fois ?</Text>
          <View className="flex flex-row mt-4 space-x-4">
            <Pressable
              className="flex items-center bg-green-500 w-28 py-4 rounded-3xl active:scale-95"
              onPress={() => handleIsFirstTime(true)}
            >
              <Text className="text-3xl nunito-bold text-white">OUI</Text>
            </Pressable>
            <Pressable
              className="flex items-center bg-red-500 w-28 py-4 rounded-3xl active:scale-95"
              onPress={() => handleIsFirstTime(false)}
            >
              <Text className="text-3xl nunito-bold text-white">NON</Text>
            </Pressable>
          </View>
        </View>
        ) }
      </View>
    </Modal>
  );
}

export default TicketCreationModal;
