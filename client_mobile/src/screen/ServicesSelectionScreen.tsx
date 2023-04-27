import { Text, View } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import { GET_SERVICES_BY_WAITING_ROOM } from '../../graphQL/query/serviceQuery';
import { useMutation, useQuery } from '@apollo/client';
import ServicesList from '../components/ServicesList';
import { useState } from 'react';
import { Service } from '../types/DataTypes';
import TicketCreationModal from '../components/TicketCreationModal';
import { TicketInput } from '../types/InputTypes';
import { CREATE_TICKET } from '../../graphQL/mutation/ticketMutations';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ServicesSelectionScreenProps = NativeStackScreenProps< RootStackParamList, 'ServicesSelectionScreen'>;

export default function ServicesSelectionScreen({
  route,
  navigation,
}: ServicesSelectionScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [serviceTicketToCreate, setServiceTicketToCreate] = useState<Service>();

  const {
    loading: servicesListLoading,
    data: servicesList,
  } = useQuery(GET_SERVICES_BY_WAITING_ROOM, {
    variables: { getServicesByWaitingRoomId: parseInt(route.params.waitingRoomId, 10) },
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

  return (
    <View className="h-screen bg-[#e5e7eb]">
      <Text className="text-center mt-6 text-xl">Merci de bien vouloir cliquer sur le service de votre
        choix
      </Text>
      { servicesListLoading && (<Text>Chargement...</Text>) }
      { serviceTicketToCreate && (
        <TicketCreationModal
          showModal={showModal}
          setShowModal={setShowModal}
          serviceTicketToCreate={serviceTicketToCreate}
          handleCreateTicket={handleCreateTicket}
        />
      ) }
      { servicesList && (
        <ServicesList servicesList={servicesList} handleOpenModal={handleOpenModal} />
      ) }
    </View>
  );
}
