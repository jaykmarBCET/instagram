import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'



const App = () => {
  return (
    <View>
      <Text className='text-blue-500'>App</Text>
      <Redirect href={"/(tabs)"} />
    </View>
  )
}

export default App