import { Text, View, Pressable } from 'react-native';
import React from 'react';
import { TicketData, UpdatedTicketData } from '../types/DataTypes';
import { StatusEnum } from '../../utils/enum/StatusEnum';

interface Props {
  currentTicketIndex: number | undefined;
  currentTicket: TicketData ;
  calledTicketId: number;
  updatedTicket: UpdatedTicketData | undefined;
  handleGoToHomePage: () => void;
}
function WaitingInformationsCard(props: Props) {
  const {
    currentTicketIndex, currentTicket, calledTicketId, updatedTicket, handleGoToHomePage,
  } = props;

  return (
    <>
      {
      currentTicketIndex! > 3 && (
        <View className="flex flex-col justify-center">
          <View className="bg-gray-100 w-screen rounded-b-[50px] mt-[2vh] pb-[6vh]">
            <Text className="text-5xl text-center">Il y a</Text>
            <Text className="text-5xl text-center font-bold">{currentTicketIndex} <Text className="text-5xl text-center font-normal">personnes</Text></Text>
            <Text className="text-5xl text-center">devant vous</Text>
            <Text> </Text>
          </View>
          <View className="-z-10 -top-10 bg-red-500 pt-[12vh] pb-[6vh] w-screen rounded-b-[50px]">
            <Text className="text-4xl font-bold text-white text-center mx-2">Ce n'est pas votre tour</Text>
          </View>
        </View>
      )
    }
      {
    currentTicketIndex! <= 3 && currentTicketIndex! >= 1 && (
      <View className="flex flex-col items-center justify-center">
        <View className="bg-gray-100 w-screen rounded-b-[50px] mt-5 pb-16">
          <Text className="text-5xl text-center">Il y a</Text>
          <Text className="text-5xl text-center font-bold">{currentTicketIndex}
            <Text className="text-5xl text-center font-normal"> {currentTicketIndex! === 1 ? 'personne' : 'personnes'}</Text>
          </Text>
          <Text className="text-5xl text-center">devant vous</Text>
        </View>
        <View className="-z-10 -top-10 bg-orange-500 pt-24 pb-16 w-screen rounded-b-[50px]">
          <Text className="text-4xl font-bold text-white text-center mx-2">C'est bientôt à vous</Text>
        </View>
      </View>
    )
  }
      {
    currentTicketIndex! === 0 && (
      <View className="flex flex-col items-center justify-center">
        <View className="bg-gray-100 w-screen rounded-b-[50px] mt-5 pb-16">
          <Text className="text-5xl text-center mx-2">Vous êtes la première personne dans la file d'attente</Text>
        </View>
        <View className="-z-10 -top-10 bg-yellow-500 pt-20 pb-10 w-screen rounded-b-[50px]">
          <Text className="text-4xl font-bold text-white text-center mx-6">Vous allez bientôt être appelé</Text>
        </View>
      </View>
    )
  }
      { currentTicketIndex === -1
      && updatedTicket?.updatedTicketByServiceId!.status === StatusEnum.TRAITE && (
        <View className="flex flex-col items-center justify-center">
          <View className="bg-gray-100 w-screen rounded-b-[50px] mt-5 pb-24">
            <Text className="text-2xl font-bold text-center mb-2">Votre demande a bien été traitée</Text>
            <Text className="text-6xl text-center font-bold mt-5">Merci pour votre visite</Text>
          </View>
          <View className="-z-10 -top-10 bg-green-500 pt-24 pb-16 w-screen rounded-b-[50px]">
            <Pressable className="text-5xl font-bold text-white text-center" onPress={handleGoToHomePage}>
              <Text
                style={{ textAlignVertical: 'center' }}
                className="text-2xl font-bold text-center mb-2"
              >Retour à l'accueil
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      {
    currentTicket.id === calledTicketId
     && updatedTicket?.updatedTicketByServiceId!.status !== StatusEnum.TRAITE && (
     <View className="flex flex-col items-center justify-center">
       <View className="bg-gray-100 w-screen rounded-b-[50px] mt-5 pb-24">
         <Text className="text-2xl font-bold text-center mb-2">Veuillez vous rendre au</Text>
         <Text className="text-6xl text-center font-bold mt-5">{ updatedTicket?.updatedTicketByServiceId.counter.name }</Text>
       </View>
       <View className="-z-10 -top-10 bg-green-500 pt-24 pb-16 w-screen rounded-b-[50px]">
         <Text className="text-5xl font-bold text-white text-center">C'est à vous !</Text>
       </View>
     </View>
    )
  }
    </>
  );
}

export default WaitingInformationsCard;
