import {
  Alert, BackHandler, Text, View,
} from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_ALL_TICKETS_FOR_SERVICE } from '../../graphQL/query/serviceQuery';
import { UPDATED_TICKET_BY_SERVICE_ID } from '../../graphQL/subscription/ticketSubscription';
import { TicketData } from '../types/DataTypes';
import { StatusEnum } from '../../utils/enum/StatusEnum';
import BottomLogo from '../components/BottomLogo';
import CurrentTicketCard from '../components/CurrentTicketCard';
import WaitingInformationsCard from '../components/WaitingInformationsCard';

type TicketScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'TicketScreen'>;

export default function ServicesSelectionScreen({ route, navigation }: TicketScreenRouteProp) {
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTicket, setCurrentTicket] = useState<TicketData>(route.params.createdTicket);
  const [currentTicketServiceId, setCurrentTicketServiceId] = useState<number>();

  const { data: ticketsList, refetch: refetchTicketsList } = useQuery(
    GET_ALL_TICKETS_FOR_SERVICE,
    {
      variables: {
        serviceId: currentTicket ! && currentTicket.service.id,
      },
    },
  );

  const handleGoToHomePage = () => {
    navigation.navigate('HomeScreen');
  };

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

  const handleBackPress = () => {
    Alert.alert(
      'Vous partez ? 😢',
      "Si vous quittez l'application, vous ne pourrez plus voir votre place dans la file d'attente. Restez avec nous et gardez un œil sur votre position ! 😉",
      [
        { text: '✅ Rester', style: 'cancel' },
        { text: '❌ Quitter', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false },
    );
    return true;
  };

  useEffect(() => {
    if (currentTicket && currentTicket.service) {
      setCurrentTicketServiceId(currentTicket.service.id);
    }
  }, [currentTicket]);

  useEffect(() => {
    if (ticketsList! && ticketsList.getAllTicketsForService) {
      const newIndex = ticketsList.getAllTicketsForService.findIndex(
        (ticket: TicketData) => ticket.status === StatusEnum.EN_ATTENTE
        && ticket.id === currentTicket.id,
      );
      setCurrentTicketIndex(newIndex);
      refetchTicketsList();
    }
  }, [ticketsList, currentTicket, refetchTicketsList]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <View className="flex items-center">
      <Text className="text-2xl text-center font-bold mt-16">Vous êtes le ticket numéro</Text>
      <CurrentTicketCard currentTicket={currentTicket} />
      <WaitingInformationsCard
        currentTicketIndex={currentTicketIndex}
        currentTicket={currentTicket}
        calledTicketId={calledTicketId}
        updatedTicket={updatedTicket}
        handleGoToHomePage={handleGoToHomePage}
      />
      <BottomLogo color="dark" />
    </View>
  );
}
