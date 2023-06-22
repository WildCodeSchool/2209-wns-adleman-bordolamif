import { Text, View } from 'react-native';
import React from 'react';

function BottomLogo({ color }: {color: string}) {
  return (
    <View
      className="absolute flex flex-row justify-center w-full"
      style={{ top: 780 }}
    >
      <Text className={`text-${color === 'light' ? 'white' : 'black'} font-bold text-5xl`}>Wait</Text>
      <Text className="text-orange-500 text-5xl">it</Text>
    </View>
  );
}

export default BottomLogo;
