import React, { useEffect, useState } from 'react'
import { Text, View, Image, TextInput, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Button from '@/components/Button'
import { supabase } from '@/lib/supabase'   // ✅ fixed import name
import { uploadImage } from '@/lib/cloudinary'
import { useAuth } from '../providers/AuthProvider'


export default function ProfileScreen() {
  const { user } = useAuth()
  const [image, setImage] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const getUserProfile = async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, username, website')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    setImage(data?.avatar_url || null)
    setUsername(data?.username || '')
    setWebsite(data?.website || '')
    setEmail(user.email || '')
  }

  const updateHandle = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      let uploadedUrl = image

      // Upload new image if it's a local file
      if (image && !image.startsWith('https')) {
        const { secure_url } = await uploadImage(image)
        uploadedUrl = secure_url
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: uploadedUrl,
          username,
          website
        })
        .eq('id', user.id)

      if (error) throw error

      Alert.alert('Profile updated successfully!')
    } catch (err: any) {
      console.error(err)
      Alert.alert('Error', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <View className="p-3 items-center flex-1">
      {image ? (
        <Image
          className="w-52 aspect-square self-center rounded-full bg-slate-500"
          source={{ uri: image }}
        />
      ) : (
        <View className="w-52 aspect-square self-center rounded-full bg-slate-500" />
      )}

      <Text onPress={pickImage} className="font-semibold text-blue-500 m-5 self-center">
        Change
      </Text>

      <View className="w-full gap-3 my-2">
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          className="border border-gray-500 p-3 w-full rounded-md"
        />
        <TextInput
          placeholder="Email"
          value={email}
          editable={false}
          className="border border-gray-500 p-3 w-full rounded-md bg-gray-100 text-gray-500"
        />
        <TextInput
          placeholder="Website"
          value={website}
          onChangeText={setWebsite}
          className="border border-gray-500 p-3 w-full rounded-md"
        />
      </View>

      <View className="p-2 gap-3 w-full m-auto">
        {!isLoading ? (
          <>
            <Button onPress={updateHandle} title="Update Profile" />
            <Button onPress={() => supabase.auth.signOut()} title="Sign Out" />
          </>
        ) : (
          <Text className="text-gray-500 self-center">Updating...</Text>
        )}
      </View>
    </View>
  )
}
