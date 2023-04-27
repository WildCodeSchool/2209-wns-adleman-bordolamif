import type { RouteProp } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import { GET_SERVICES_BY_WAITING_ROOM } from '../../graphQL/query/serviceQuery';
import { useQuery } from '@apollo/client';
import ServicesList from '../components/ServicesList';

// type NavigationProps = NativeStackScreenProps<RootStackParamList, 'ServicesSelectionScreen'>;

interface Props {
    // navigation:NavigationProps,
    route: RouteProp<RootStackParamList, 'ServicesSelectionScreen'>,
}

export default function ServicesSelectionScreen(props:Props) {
  const {
    route,
    // navigation,
  } = props;
  const {
    loading: servicesListLoading,
    data: servicesList,
  } = useQuery(GET_SERVICES_BY_WAITING_ROOM, {
    variables: { getServicesByWaitingRoomId: parseInt(route.params.waitingRoomId, 10) },
  });

  return (
    <View>
      { servicesListLoading && (<Text>Chargement...</Text>)}
      { servicesList && (<ServicesList servicesList={servicesList} />)}
    </View>
  );
}
