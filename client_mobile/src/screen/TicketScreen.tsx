import { Text, View } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_ALL_TICKETS_FOR_SERVICE } from '../../graphQL/query/serviceQuery';
import { UPDATED_TICKET_BY_SERVICE_ID } from '../../graphQL/subscription/ticketSubscription';
import { TicketData } from '../types/DataTypes';
import { StatusEnum } from '../../utils/enum/StatusEnum';
import BottomLogo from '../components/BottomLogo';

type TicketScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'TicketScreen'>;

export default function ServicesSelectionScreen({ route }: TicketScreenRouteProp) {
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>();
  const [currentTicket, setCurrentTicket] = useState<TicketData>(route.params.createdTicket);
  const [currentTicketServiceId, setCurrentTicketServiceId] = useState<number>();

  const { data: ticketsList } = useQuery(
    GET_ALL_TICKETS_FOR_SERVICE,
    {
      variables: {
        serviceId: currentTicket.service.id,
      },
    },
  );

  const {
    data: updatedTicket,
  } = useSubscription(
    UPDATED_TICKET_BY_SERVICE_ID,
    {
      variables: {
        id: currentTicketServiceId,
      },
      skip: !currentTicketServiceId,
    },
  );

  const calledTicketId = updatedTicket?.updatedTicketByServiceId.id || null;

  useEffect(() => {
    if (currentTicket && currentTicket.service) {
      setCurrentTicketServiceId(currentTicket.service.id);
    }
  }, [currentTicket]);

  useEffect(() => {
    setCurrentTicketIndex(ticketsList! && ticketsList.getAllTicketsForService.filter(
      (ticket: TicketData) => ticket.status === StatusEnum.EN_ATTENTE,
    ).findIndex(
      (ticket: TicketData) => ticket.id === currentTicket.id,
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsList]);

  // useEffect(() => {
  //   console.log(1);
  //   if (!updateTicketLoading && updatedTicket!) {
  //     console.log(2);
  //     subscribeToMoreTicket({
  //       document: UPDATED_TICKET_BY_SERVICE_ID,
  //       updateQuery: (prev, { subscriptionData }) => {
  //         console.log('sub', subscriptionData);
  //         console.log(3);
  //         if (!subscriptionData.data) return prev;
  //
  //         const ticketToUpdate = subscriptionData.data.updatedTicketByServiceId;
  //
  //         if (ticketToUpdate.id === currentTicket.id) setCurrentTicket(ticketToUpdate);
  //
  //         const newList = prev.getAllTicketsForService.map(
  //           (ticket: TicketData) => (ticket.id === ticketToUpdate.id ? ticketToUpdate : ticket),
  //         );
  //
  //         // eslint-disable-next-line no-restricted-syntax
  //         console.log('|||===newList===>>', newList);
  //
  //         const filteredNewList = newList.filter(
  //         (ticket: TicketData) => ticket.status === StatusEnum.EN_ATTENTE);
  //
  //         return {
  //           ...prev,
  //           getAllTicketsForService: filteredNewList,
  //         };
  //       },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [updatedTicket, subscribeToMoreTicket, updateTicketLoading]);

  return (
    <View className="flex items-center">
      <Text className="text-2xl text-center font-bold mt-16">Vous êtes le ticket numéro</Text>
      <View className="bg-white p-4 my-10 rounded-xl">
        <View className="flex flex-row mb-3 items-center">
          <View
            className="px-4 py-2 mr-3 rounded-2xl text-white"
            style={{ backgroundColor: `${currentTicket.service.color}` }}
          >
            <Text className="text-white text-3xl">{ currentTicket.service.acronym }</Text>
          </View>
          <Text className="text-5xl font-bold">{ currentTicket.name }</Text>
        </View>
        <Text className="text-4xl font-semibold text-center">
          { currentTicket.service.name }
        </Text>
      </View>
      {
        currentTicketIndex! > 3 && (
          <View className="flex flex-col justify-center">
            <View>
              <Text className="text-5xl text-center">Il y a</Text>
              <Text className="text-5xl text-center font-bold">{currentTicketIndex} <Text className="text-5xl text-center font-normal">personnes</Text></Text>
              <Text className="text-5xl text-center">devant vous</Text>
            </View>
            <View className="bg-red-600 py-12 mt-20 w-screen rounded-b-[50px]">
              <Text className="text-5xl font-bold text-white text-center">Ce n'est pas</Text>
              <Text className="text-5xl font-bold text-white text-center">votre tour</Text>
            </View>
          </View>
        )
      }
      {
        currentTicketIndex! <= 3 && currentTicketIndex! >= 1 && (
          <View className="flex flex-col items-center justify-center">
            <View>
              <Text className="text-5xl text-center">Il y a</Text>
              <Text className="text-5xl text-center font-bold">{currentTicketIndex} <Text className="text-5xl text-center font-normal">{currentTicketIndex! === 1 ? 'personne' : 'personnes'}</Text></Text>
              <Text className="text-5xl text-center">devant vous</Text>
            </View>
            <View className="bg-orange-500 py-12 mt-20 w-screen rounded-b-[50px]">
              <Text className="text-5xl font-bold text-white text-center">C'est bientôt</Text>
              <Text className="text-5xl font-bold text-white text-center">à vous</Text>
            </View>
          </View>
        )
      }
      {
        currentTicketIndex! === 0 && (
          <View className="flex flex-col items-center justify-center">
            <View>
              <Text className="text-5xl text-center">Il n'y a</Text>
              <Text className="text-5xl text-center">personne</Text>
              <Text className="text-5xl text-center">devant vous</Text>
            </View>
            <View className="bg-green-500 py-12 mt-20 w-screen rounded-b-[50px]">
              <Text className="text-5xl font-bold text-white text-center">Vous allez bientôt</Text>
              <Text className="text-5xl font-bold text-white text-center">être appellé</Text>
            </View>
          </View>
        )
      }
      {
        currentTicket.id === calledTicketId && (
          <View className="flex flex-col items-center justify-center">
            <View>
              <Text className="text-2xl font-bold text-center">Veuillez vous rendre au</Text>
              <View className="bg-white py-4 px-5 mt-5 rounded-lg">
                <Text className="text-6xl text-center font-bold">{ updatedTicket?.updatedTicketByServiceId.counter.name }</Text>
              </View>
            </View>
            <View className="bg-green-500 py-12 mt-20 w-screen rounded-b-[50px]">
              <Text className="text-5xl font-bold text-white text-center">C'est à vous !</Text>
              <Text className="text-5xl font-bold text-white text-center"> </Text>

            </View>
          </View>
        )
      }

      <BottomLogo color="dark" />
    </View>
  );
}
