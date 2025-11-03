import { useEffect, useState } from "react";
import { Image, Text, TextInput, View, Alert } from "react-native";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import Button from "@/components/Button";
import { uploadImage } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../providers/AuthProvider";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<
    "image" | "video" | "livePhoto" | "pairedVideo" | undefined
  >();

  const { session } = useAuth();

  useEffect(() => {
    if (!media) pickMedia();
  }, [media]);

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type);
      }
    } catch (error) {
      console.error("Media picking error:", error);
    }
  };

  const createPost = async () => {
    if (!media || !session?.user?.id) return;

    try {
      const response = await uploadImage(media);
      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            caption,
            image: response?.public_id,
            user_id: session.user.id,
          },
        ])
        .select();

      if (error) throw error;

      router.push("/(tabs)");
    } catch (err: any) {
      console.error("Upload failed:", err);
      Alert.alert("Error", "Failed to upload post. Try again!");
    }
  };

  return (
    <View className="p-3 items-center flex-1 bg-white">
      {/* Media Preview */}
      {!media ? (
        <View className="w-52 aspect-[3/4] rounded-lg bg-slate-300" />
      ) : mediaType === "image" ? (
        <Image
          source={{ uri: media }}
          className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
        />
      ) : (
        <Video
          className="w-full rounded-lg bg-slate-300"
          style={{ aspectRatio: 16 / 9 }}
          source={{ uri: media }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
      )}

      <Text
        onPress={pickMedia}
        className="text-blue-500 font-semibold m-5 underline"
      >
        Change Media
      </Text>

      {/* TextArea for caption */}
      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="What's on your mind?"
        className="w-full p-3 border border-gray-300 rounded-md h-32 bg-gray-100 text-base"
        multiline
        textAlignVertical="top"
      />

      {/* Submit Button */}
      <View className="mt-auto w-full">
        <Button title="Share" onPress={createPost} />
      </View>
    </View>
  );
}
