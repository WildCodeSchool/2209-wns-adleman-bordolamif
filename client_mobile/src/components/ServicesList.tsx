import React from 'react';
import {
  FlatList, Pressable, Text, View,
} from 'react-native';
import { StatusEnum } from '../../utils/enum/StatusEnum';
import { Service, ServicesByWaitingRoom } from '../types/DataTypes';

interface Props {
    servicesList: ServicesByWaitingRoom
    handleOpenModal: (service: Service) => void

}
function ServicesList(props:Props) {
  const { servicesList, handleOpenModal } = props;
  return (
    <FlatList
      className="flex flex-col p-5"
      data={servicesList.getServicesByWaitingRoomId}
      renderItem={({ item }) => {
        if (item.isOpen) {
          return (
            <Pressable
              className="bg-white p-5 mt-5 rounded-3xl active:scale-95 transfo"
              onPress={() => handleOpenModal(item)}
            >
              <View className="flex flex-row mb-8 items-center justify-center gap-4">
                <View
                  className="px-4 h-10 rounded-2xl text-white nunito-bold text-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}` }}
                >
                  <Text>{ item.acronym }</Text>
                </View>
                <Text className="text-3xl">{ item.name }</Text>
              </View>
              <Text className="text-xl">
                Tickets en attente: { item.tickets.filter(
                (ticket: { status: number }) => ticket.status === StatusEnum.EN_ATTENTE,
              ).length }
              </Text>
            </Pressable>
          );
        }
        return null;
      }}
    />
  );
}

export default ServicesList;
