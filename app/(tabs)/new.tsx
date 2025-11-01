import { View, Text, Image, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import Button from '@/components/Button'



const PostScreen = () => {
  const [caption, setCaption] = useState<string>("")
  const [image, setImage] = useState<string | null>("")


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1
    })

    if(result.canceled)return
     setImage(result.assets[0].uri )
  }

  useEffect(() => {
    if (!image) {
      pickImage()
    }
  }, [image])
  return (
    <View className='p-3 items-center flex-1'>
      <Image
        source={{ uri: image ? image : "" }}
        className='w-52  aspect-[3/4] rounded-lg bg-slate-300'

      />
      <Text onPress={pickImage} className='text-blue-500 font-semibold m-5'>Change</Text>
      <TextInput value={caption} onChangeText={(value) => setCaption(value)} className="w-full p-3" placeholder='What is on your mind' />
      <View className='mt-auto w-full'>
        <Button onPress={()=>""} title='Share'/>
      </View>
    </View>
  )
}

export default PostScreen