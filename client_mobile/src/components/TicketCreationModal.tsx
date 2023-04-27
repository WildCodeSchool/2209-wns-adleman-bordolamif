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
}

function TicketCreationModal(props: Props) {
  const {
    showModal,
    setShowModal,
    serviceTicketToCreate,
    handleCreateTicket,
  } = props;

  const [ticketToCreate, setTicketToCreate] = useState<TicketInput | null>();

  const handleConfirmService = () => {
    setTicketToCreate({
      isFirstTime: false,
      service: { id: serviceTicketToCreate.id },
    });
  };

  const handleIsFirstTime = async (isFirstTime: boolean) => {
    const ticketToSend = {
      isFirstTime,
      service: { id: serviceTicketToCreate.id },
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
          <View>
            <Text>Confirmez-vous votre choix ?</Text>
            <Pressable
              className="bg-red-500 w-[10rem] py-4 text-3xl nunito-bold text-white rounded-3xl active:scale-95"
              onPress={() => setShowModal(!showModal)}
            >
              <Text>NON</Text>
            </Pressable>
            <Pressable
              className="bg-green-500 w-[10rem] py-4 text-3xl nunito-bold text-white rounded-3xl active:scale-95"
              onPress={handleConfirmService}
            >
              <Text>OUI</Text>
            </Pressable>
          </View>
        ) }
        { ticketToCreate && (
          <View>
            <Text>Est-ce votre première fois ?</Text>
            <Pressable
              className="bg-green-500 w-[10rem] py-4 text-3xl nunito-bold text-white rounded-3xl active:scale-95"
              onPress={() => handleIsFirstTime(true)}
            >
              <Text>OUI</Text>
            </Pressable>
            <Pressable
              className="bg-red-500 w-[10rem] py-4 text-3xl nunito-bold text-white rounded-3xl active:scale-95"
              onPress={() => handleIsFirstTime(false)}
            >
              <Text>NON</Text>
            </Pressable>
          </View>
        ) }
      </View>
    </Modal>
  );
}

export default TicketCreationModal;
