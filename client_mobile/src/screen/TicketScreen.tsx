import { Text, View } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

type TicketScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'TicketScreen'>;

export default function ServicesSelectionScreen({ route }: TicketScreenRouteProp) {
  const ticket = route.params.createdTicket;
  return (
    <View>
      <Text className="text-4xl text-center">Vous êtes le ticket numéro:</Text>
      <View className="bg-white p-5 mt-5 rounded-3xl active:scale-95 transfo">
        <View className="flex flex-row mb-8 items-center justify-center gap-4">
          <View
            className="px-4 h-10 rounded-2xl text-white nunito-bold text-2xl flex items-center justify-center"
            style={{ backgroundColor: `${ticket.service.color}` }}
          >
            <Text>{ ticket.service.acronym }</Text>
          </View>
          <Text className="text-3xl">{ ticket.name }</Text>
        </View>
        <Text className="text-xl text-center">
          { ticket.service.name }
        </Text>
      </View>
      <Text className="text-4xl text-center">Il y a X personne devant vous (WIP)</Text>
    </View>
  );
}
