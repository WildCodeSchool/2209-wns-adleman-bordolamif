import { Text, View } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_ALL_TICKETS_FOR_SERVICE } from '../../graphQL/query/serviceQuery';
import { UPDATED_TICKET_BY_SERVICE_ID } from '../../graphQL/subscription/ticketSubscription';
import { TicketData } from '../types/DataTypes';

type TicketScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'TicketScreen'>;

export default function ServicesSelectionScreen({ route }: TicketScreenRouteProp) {
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>();
  const [currentTicket, setCurrentTicket] = useState<TicketData>(route.params.createdTicket);
  const [currentTicketServiceId, setCurrentTicketServiceId] = useState<number>();

  const { data: ticketsList, refetch, subscribeToMore: subscribeToMoreTicket } = useQuery(
    GET_ALL_TICKETS_FOR_SERVICE,
    {
      variables: {
        serviceId: currentTicket.service.id,
      },
    },
  );

  const {
    data: updatedTicket,
    loading: updateTicketLoading,
  } = useSubscription(
    UPDATED_TICKET_BY_SERVICE_ID,
    {
      variables: {
        id: currentTicketServiceId,
      },
      skip: !currentTicketServiceId,
    },
  );

  useEffect(() => {
    if (currentTicket && currentTicket.service) {
      setCurrentTicketServiceId(currentTicket.service.id);
    }
  }, [currentTicket]);

  useEffect(() => {
    setCurrentTicketIndex(ticketsList?.getAllTicketsForService.findIndex(
      (ticket: TicketData) => ticket.id === currentTicket.id,
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsList, subscribeToMoreTicket]);

  useEffect(() => {
    if (!updateTicketLoading && updatedTicket!) {
      subscribeToMoreTicket({
        document: UPDATED_TICKET_BY_SERVICE_ID,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const ticketToUpdate = subscriptionData.data.updatedTicketByServiceId;

          if (ticketToUpdate.id === currentTicket.id) setCurrentTicket(ticketToUpdate);

          const newList = prev.getAllTicketsForService.map(
            (ticket: TicketData) => (ticket.id === ticketToUpdate.id ? ticketToUpdate : ticket),
          );

          // eslint-disable-next-line no-restricted-syntax
          console.log('|||===newList===>>', newList);

          const filteredNewList = newList.filter((ticket: TicketData) => ticket.status === 1);

          return {
            ...prev,
            getAllTicketsForService: filteredNewList,
          };
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedTicket, subscribeToMoreTicket, updateTicketLoading]);

  return (
    <View>
      <Text className="text-4xl text-center">Vous êtes le ticket numéro:</Text>
      <View className="bg-white p-5 mt-5 rounded-3xl active:scale-95 transfo">
        <View className="flex flex-row mb-8 items-center justify-center gap-4">
          <View
            className="px-4 h-10 rounded-2xl text-white nunito-bold text-2xl flex items-center justify-center"
            style={{ backgroundColor: `${currentTicket.service.color}` }}
          >
            <Text>{ currentTicket.service.acronym }</Text>
          </View>
          <Text className="text-3xl">{ currentTicket.name }</Text>
        </View>
        <Text className="text-xl text-center">
          { currentTicket.service.name }
        </Text>
      </View>
      <Text className="text-4xl text-center">{currentTicketIndex}</Text>
    </View>
  );
}
