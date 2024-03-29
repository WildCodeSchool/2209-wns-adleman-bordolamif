import { Text, View } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import { GET_SERVICES_BY_WAITING_ROOM } from '../../graphQL/query/serviceQuery';
import { useMutation, useQuery } from '@apollo/client';
import ServicesList from '../components/ServicesList';
import { useEffect, useRef, useState } from 'react';
import { Service } from '../types/DataTypes';
import TicketCreationModal from '../components/TicketCreationModal';
import { TicketInput } from '../types/InputTypes';
import { CREATE_TICKET } from '../../graphQL/mutation/ticketMutations';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Subscription } from 'expo-modules-core';
import { registerForPushNotificationsAsync } from '../../utils/Notifications';
import * as Notifications from 'expo-notifications';
import BottomLogo from '../components/BottomLogo';

type ServicesSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'ServicesSelectionScreen'>;

export default function ServicesSelectionScreen({
  route,
  navigation,
}: ServicesSelectionScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [serviceTicketToCreate, setServiceTicketToCreate] = useState<Service>();
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const {
    loading: servicesListLoading,
    data: servicesList,
  } = useQuery(GET_SERVICES_BY_WAITING_ROOM, {
    variables: { id: parseInt(route.params.waitingRoomId, 10) },
  });

  const [CreateTicket] = useMutation(CREATE_TICKET);

  const handleCreateTicket = async (ticket: TicketInput) => {
    const { data } = await CreateTicket({ variables: { data: ticket } });
    navigation.navigate('TicketScreen', { createdTicket: data.createTicket });
  };
  const handleOpenModal = (service: Service) => {
    setServiceTicketToCreate(service);
    setShowModal(true);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token || ''));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // eslint-disable-next-line no-restricted-syntax
      console.log('received', { notification });
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // eslint-disable-next-line no-restricted-syntax
      console.log('notif interaction', { response });
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }

      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <View className="h-full bg-[#e5e7eb]">
      <View className="pb-24">
        <Text className="text-center mt-6 text-3xl">Merci de bien vouloir</Text>
        <Text className="text-center text-3xl font-bold">
          cliquer sur le service
        </Text>
        <Text className="text-center text-3xl"> de votre choix
        </Text>
        { servicesListLoading && (<Text className="mt-32 text-center text-3xl">Chargement...</Text>) }
        { !servicesListLoading && !servicesList && (
        <Text className="mt-32 text-center text-3xl">Aucun service disponible</Text>
        )}
        <BottomLogo color="dark" />
        { serviceTicketToCreate && (
        <TicketCreationModal
          showModal={showModal}
          setShowModal={setShowModal}
          serviceTicketToCreate={serviceTicketToCreate}
          handleCreateTicket={handleCreateTicket}
          expoPushToken={expoPushToken}
        />
        ) }
        { servicesList && (
        <ServicesList servicesList={servicesList} handleOpenModal={handleOpenModal} />
        ) }
      </View>
    </View>
  );
}
