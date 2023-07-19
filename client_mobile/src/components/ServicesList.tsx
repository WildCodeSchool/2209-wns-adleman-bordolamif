import React from 'react';
import {
  FlatList, Pressable, Text, View,
} from 'react-native';
import { StatusEnum } from '../../utils/enum/StatusEnum';
import { Service, ServicesByWaitingRoom } from '../types/DataTypes';
import { isToday } from '../../utils/Dates';

interface Props {
    servicesList: ServicesByWaitingRoom
    handleOpenModal: (service: Service) => void

}
function ServicesList(props:Props) {
  const { servicesList, handleOpenModal } = props;

  return (
    <FlatList
      className="flex flex-col px-5 h-[85%]"
      data={servicesList.getServicesByWaitingRoomId}
      renderItem={({ item }) => {
        if (item.isOpen) {
          return (
            <Pressable
              style={{
                shadowColor: '#171717',
                shadowOffset: { width: -2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
              className="bg-white p-4 my-4 rounded-3xl active:scale-95"
              onPress={() => handleOpenModal(item)}
            >
              <View className="flex flex-row mb-4 items-center justify-start">
                <View
                  className="px-4 py-2 mr-2 rounded-2xl text-white "
                  style={{ backgroundColor: `${item.color}` }}
                >
                  <Text className="text-white text-3xl">{ item.acronym }</Text>
                </View>
                <Text className="text-3xl font-bold">{ item.name }</Text>
              </View>
              <View className="flex flex-row justify-center">
                <Text className="text-xl">
                  Tickets en attente:
                </Text>
                <Text className="text-xl font-bold ml-2">{ item.tickets.filter(
                  (ticket: { status: number, createdAt: string }) => (
                    isToday(ticket.createdAt)
                  && ticket.status === StatusEnum.EN_ATTENTE),
                ).length }
                </Text>
              </View>
            </Pressable>
          );
        }
        return null;
      }}
    />
  );
}

export default ServicesList;
