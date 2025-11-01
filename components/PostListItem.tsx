import { View, Text, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import {Ionicons, Feather} from "@expo/vector-icons"
import {AdvancedImage} from "cloudinary-react-native"


import {thumbnail} from "@cloudinary/url-gen/actions/resize"
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners"
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity"
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn"
import { cld } from '@/lib/cloudinary'





const PostListItem = ({post}:{post:Post} ) => {
  const {width} = useWindowDimensions()

  const image = cld.image(post.image)
  const avatar = cld.image(post.user.avatar_url)
  
  image.resize(thumbnail().width( Math.round(width)).height(Math.round(width)))
  avatar.resize(thumbnail().width(100).height(100).gravity(focusOn(FocusOn.face())))
  
    
  return (
    <View className='bg-white'>
      <View className='p-2 flex flex-row items-center gap-2'>
        <AdvancedImage className='w-12 aspect-square rounded-full' cldImg={avatar}/>
        {/* <Image
          source={{ uri: post.user.image_url }}
          className='w-12 aspect-square rounded-full '
        /> */}
        <Text className='font-semibold text-md'>{post.user.username}</Text>
      </View>
      <AdvancedImage cldImg={image}  className='w-full aspect-[4/3]'  />
      {/* <Image className='w-full  aspect-[4/3]' source={{ uri: post.image_url }} /> */}

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


interface User {
  id: string;
  avatar_url: string;
  image_url: string;
  username: string;
}

interface Post {
  id: string;
  image: string;
  image_url: string;
  caption: string;
  user: User;
}
