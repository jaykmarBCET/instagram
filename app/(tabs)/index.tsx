import { View, Text, Image, FlatList } from 'react-native'
import React from 'react'
import posts from "@/assets/data/posts.json"
import PostListItem from '@/components/PostListItem'



const FeedScreen = () => {

  return (

    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: 10,alignSelf:"center",maxWidth:512,width:"100%" }}
      className='self-center'
      renderItem={({ item }) => (
        <PostListItem post={item} />
      )}
    />

  )
}

export default FeedScreen