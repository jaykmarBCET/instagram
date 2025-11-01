import React, { use, useState } from 'react'
import { Text, View, Image, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Button from '@/components/Button'

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>("")
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [website, setWebsite] = useState<string>("")


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })

    if (result.canceled) {
      return
    }

    setImage(result.assets[0].uri)
  }
  return (
    <View className='p-3 items-center flex-1'>
      {
        image ? (
          <Image className='w-52 aspect-square self-center rounded-full bg-slate-500' source={{ uri: image }} />
        ) : <View className='w-52 aspect-square self-center rounded-full bg-slate-500' />
      }

      <Text onPress={pickImage} className='font-semibold text-blue-500 m-5 self-center'>Change</Text>
      <View className='w-full gap-3 my-2'>
        <TextInput
          placeholder='Email'

          value={username}
          onChangeText={setUsername}
          className='border border-gray-500  p-3 w-full rounded-md '
        />
        <TextInput
          placeholder='Username'
          value={email}
          onChangeText={setEmail}
          className='border border-gray-500 p-3 w-full rounded-md '
        />
        <TextInput
          placeholder='Website'
          value={website}

          onChangeText={setWebsite}
          className='border border-gray-500 p-3 w-full rounded-md '
        />
      </View>
      <View className='p-2 gap-3 w-full m-auto'>
        <Button onPress={() => ""} title='Update Profile' />
        <Button onPress={() => ""} title='Sign Out' />
      </View>
    </View>
  )
}

