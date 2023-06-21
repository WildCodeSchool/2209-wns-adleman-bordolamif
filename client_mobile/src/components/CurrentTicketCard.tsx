import { Text, View } from 'react-native';
import { TicketData } from '../types/DataTypes';

function CurrentTicketCard({ currentTicket }: { currentTicket: TicketData }) {
  return (
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
  );
}

export default CurrentTicketCard;
