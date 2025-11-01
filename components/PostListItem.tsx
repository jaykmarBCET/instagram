import { View, Text, Image } from 'react-native'
import React from 'react'

import {Ionicons, Feather} from "@expo/vector-icons"



const PostListItem = ({post} ) => {
    
  return (
    <View className='bg-white'>
      <View className='p-2 flex flex-row items-center gap-2'>
        <Image
          source={{ uri: post.user.image_url }}
          className='w-12 aspect-square rounded-full '
        />
        <Text className='font-semibold text-md'>{post.user.username}</Text>
      </View>
      <Image className='w-full  aspect-[4/3]' source={{ uri: post.image_url }} />

      <View className='flex flex-row gap-3 p-3'>
        <Feather name="heart" size={25}/>
        <Ionicons name='chatbubble-outline' size={25} />
        <Feather name='send' size={20}/>
        <Feather className='ml-auto' name='bookmark' size={25}/>
      </View>
    </View>
  )
}

export default PostListItem