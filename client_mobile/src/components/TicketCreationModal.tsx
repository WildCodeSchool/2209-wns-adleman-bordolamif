import {
  Dimensions, Pressable, Text, View,
} from 'react-native';
import React, { useState } from 'react';
import { TicketInput } from '../types/InputTypes';
import { Service } from '../types/DataTypes';
import { ReactNativeModal } from 'react-native-modal';
import BottomLogo from './BottomLogo';

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
    <ReactNativeModal
      backdropOpacity={1}
      backdropColor="#e5e7eb"
      animationIn="zoomIn"
      animationOut="zoomOut"
      deviceHeight={Dimensions.get('window').height + 100}
      coverScreen={false}
      isVisible={showModal}
      onBackButtonPress={() => {
        setShowModal(!showModal);
      }}
    >
      <View className="w-full py-10">
        { !ticketToCreate && (
          <View className="h-full">
            <Text className="text-3xl text-center mb-5">Vous avez sélectionné le service</Text>
            <View className="bg-white w-full py-5 mt-4 mb-20 rounded-3xl">
              <View className="flex flex-row items-center justify-center">
                <View
                  className="px-4 py-2 mr-3 rounded-2xl text-white"
                  style={{ backgroundColor: `${serviceTicketToCreate.color}` }}
                >
                  <Text className="text-4xl text-white">{ serviceTicketToCreate.acronym }</Text>
                </View>
                <Text className="text-4xl font-bold">{ serviceTicketToCreate.name }</Text>
              </View>
            </View>
            <Text className="text-center text-3xl font-bold mb-10">Confirmez-vous votre choix ?</Text>
            <View className="items-center">
              <Pressable
                className="bg-orange-500 px-5 py-4 mb-10 rounded-full active:scale-95"
                onPress={handleConfirmService}
              >
                <Text className="text-2xl text-center text-white">Oui, je confirme mon choix</Text>
              </Pressable>
              <Pressable
                className="bg-gray-400 w-52 py-3 rounded-full active:scale-95"
                onPress={() => setShowModal(!showModal)}
              >
                <Text className="text-2xl text-center text-white">Non</Text>
              </Pressable>
            </View>
          </View>
        ) }
        { ticketToCreate && (
          <View className="flex justify-center">
            <Text className="text-center font-bold text-3xl mb-20">Est-ce votre premier rendez-vous ?</Text>
            <View className="items-center">
              <Pressable
                className="bg-orange-500 w-5/6 py-4 mb-10 rounded-3xl shadow-xl active:scale-95"
                onPress={() => handleIsFirstTime(true)}
              >
                <Text className="text-2xl text-center text-white">Oui, c'est mon premier rendez-vous</Text>
              </Pressable>
              <Pressable
                className="bg-gray-400 w-52 py-3 rounded-full active:scale-95 shadow-xl"
                onPress={() => handleIsFirstTime(false)}
              >
                <Text className="text-2xl text-center text-white">Non</Text>
              </Pressable>
            </View>
          </View>
        ) }
      </View>
      <BottomLogo color="dark" />
    </ReactNativeModal>
  );
}

export default TicketCreationModal;
